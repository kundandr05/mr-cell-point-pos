"use server";

import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function fetchInvoiceForReturn(invoiceNumber: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const invoice = await prisma.invoice.findUnique({
    where: { invoiceNumber },
    include: {
      items: {
        include: {
          product: true
        }
      },
      returns: {
        include: {
          items: true
        }
      }
    }
  });

  if (!invoice) return null;

  // Calculate remaining quantities available to return
  const returnedQuantities: Record<string, number> = {};
  invoice.returns.forEach(r => {
    r.items.forEach(i => {
      returnedQuantities[i.productId] = (returnedQuantities[i.productId] || 0) + i.quantity;
    });
  });

  const availableItems = invoice.items.map(item => {
    const returnedQty = returnedQuantities[item.productId] || 0;
    return {
      ...item,
      returnedQty,
      availableToReturn: item.quantity - returnedQty
    };
  });

  return { ...invoice, items: availableItems };
}

interface ReturnInput {
  invoiceId: string;
  reason: string;
  items: {
    productId: string;
    quantity: number;
    refundAmount: number;
  }[];
}

export async function processReturn(data: ReturnInput) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  try {
    const totalRefund = data.items.reduce((sum, item) => sum + item.refundAmount, 0);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Return record
      const count = await tx.return.count();
      const returnNumber = `RET-${(count + 1).toString().padStart(6, '0')}`;

      const newReturn = await tx.return.create({
        data: {
          returnNumber,
          invoiceId: data.invoiceId,
          reason: data.reason,
          refundAmount: totalRefund,
          items: {
            create: data.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              refundAmount: item.refundAmount
            }))
          }
        }
      });

      // 2. Increment stock for returned products
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              increment: item.quantity
            }
          }
        });
      }

      // 3. Update original invoice totals (reducing subtotal and grandTotal)
      await tx.invoice.update({
        where: { id: data.invoiceId },
        data: {
          grandTotal: {
            decrement: totalRefund
          }
        }
      });

      return newReturn;
    });

    revalidatePath("/dashboard/returns");
    revalidatePath("/dashboard/invoices");
    revalidatePath("/dashboard/products");

    return { success: true, returnId: result.id };
  } catch (error) {
    console.error("Failed to process return:", error);
    return { success: false, error: "Failed to process return" };
  }
}
