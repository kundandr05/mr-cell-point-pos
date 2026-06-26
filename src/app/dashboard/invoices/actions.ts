"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getInvoices() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const invoices = await prisma.invoice.findMany({
    orderBy: { date: 'desc' },
    include: {
      items: true
    }
  });
  
  return invoices;
}

export async function deleteInvoice(invoiceId: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  // Fetch the invoice and items to restore stock
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { items: true }
  });

  if (!invoice) throw new Error("Invoice not found");

  // Perform transaction: restore stock -> delete items -> delete invoice
  await prisma.$transaction(async (tx) => {
    // 1. Restore stock
    for (const item of invoice.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { increment: item.quantity } }
      });
    }

    // 2. Delete the invoice (cascade will handle items, but just to be safe we can let Prisma do it if configured, else explicitly delete)
    await tx.invoiceItem.deleteMany({
      where: { invoiceId: invoice.id }
    });
    
    // Also delete any returns associated with this invoice to avoid orphaned records or foreign key constraints
    await tx.return.deleteMany({
      where: { invoiceId: invoice.id }
    });

    await tx.invoice.delete({
      where: { id: invoice.id }
    });
  });

  revalidatePath("/dashboard/invoices");
  revalidatePath("/dashboard");
  return { success: true };
}
