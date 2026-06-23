"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function searchProducts(query: string) {
  if (!query) return [];
  
  return await prisma.product.findMany({
    where: {
      OR: [
        { barcode: { equals: query } },
        { sku: { contains: query, mode: 'insensitive' } },
        { name: { contains: query, mode: 'insensitive' } },
      ]
    },
    take: 10,
    include: {
      brand: true,
      category: true,
    }
  });
}

export async function createInvoice(data: any) {
  try {
    const settings = await prisma.shopSettings.findFirst();
    const prefix = settings?.invoicePrefix || "INV-";
    
    const result = await prisma.$transaction(async (tx) => {
      // Get next invoice number
      const count = await tx.invoice.count();
      const invoiceNumber = `${prefix}${(count + 1).toString().padStart(4, '0')}`;
      
      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          customerName: data.customerName || null,
          customerPhone: data.customerPhone || null,
          paymentMode: data.paymentMode,
          subtotal: data.subtotal,
          cgst: data.cgst,
          sgst: data.sgst,
          igst: data.igst,
          grandTotal: data.grandTotal,
          discount: data.discount || 0,
          items: {
            create: data.items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              rate: item.rate,
              gstPercent: item.gstPercent,
              gstAmount: item.gstAmount,
              totalAmount: item.totalAmount,
            }))
          }
        }
      });

      // Reduce inventory
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: item.quantity
            }
          }
        });
      }

      return invoice;
    });

    revalidatePath("/dashboard/billing");
    revalidatePath("/dashboard/invoices");
    revalidatePath("/dashboard/products");
    
    return { success: true, invoiceId: result.id };
  } catch (error) {
    console.error("Failed to create invoice:", error);
    return { success: false, error: "Failed to generate invoice." };
  }
}
