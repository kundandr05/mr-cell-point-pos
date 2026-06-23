"use server";

import { auth } from "@/auth";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getPurchases() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  return await prisma.purchase.findMany({
    include: {
      supplier: true,
      items: {
        include: {
          product: true,
        }
      }
    },
    orderBy: { purchaseDate: "desc" },
  });
}

export async function getPurchaseFormData() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const [suppliers, products] = await Promise.all([
    prisma.supplier.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({ orderBy: { name: "asc" } }),
  ]);
  
  return { suppliers, products };
}

interface PurchaseItemInput {
  productId: string;
  quantity: string;
  purchasePrice: string;
  gstAmount: string;
}

interface PurchaseInput {
  invoiceNumber: string;
  supplierId: string;
  purchaseDate: string;
  totalAmount: number;
  gstAmount: number;
  items: PurchaseItemInput[];
}

export async function createPurchase(data: PurchaseInput) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  try {
    // We use a Prisma transaction to ensure the purchase is recorded AND inventory is updated atomically.
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Purchase record
      const purchase = await tx.purchase.create({
        data: {
          invoiceNumber: data.invoiceNumber,
          supplierId: data.supplierId,
          purchaseDate: new Date(data.purchaseDate),
          totalAmount: data.totalAmount,
          gstAmount: data.gstAmount,
          items: {
            create: data.items.map((item: PurchaseItemInput) => ({
              productId: item.productId,
              quantity: parseInt(item.quantity),
              purchasePrice: parseFloat(item.purchasePrice),
              gstAmount: parseFloat(item.gstAmount || "0"),
            }))
          }
        }
      });

      // 2. Update Inventory for each item
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              increment: parseInt(item.quantity)
            }
          }
        });
      }

      return purchase;
    });

    revalidatePath("/dashboard/purchases");
    revalidatePath("/dashboard/products");
    return { success: true, purchase: result };
  } catch (error: unknown) {
    console.error("Failed to create purchase:", error);
    if (typeof error === "object" && error !== null && "code" in error && (error as {code: string}).code === "P2002") {
      return { success: false, error: "A purchase with this Invoice Number already exists." };
    }
    return { success: false, error: "Failed to record purchase." };
  }
}

export async function deletePurchase(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  try {
    // To safely delete a purchase, we need to decrement the inventory back.
    await prisma.$transaction(async (tx) => {
      const purchase = await tx.purchase.findUnique({
        where: { id },
        include: { items: true }
      });
      
      if (!purchase) throw new Error("Purchase not found");

      for (const item of purchase.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: item.quantity
            }
          }
        });
      }

      await tx.purchaseItem.deleteMany({ where: { purchaseId: id } });
      await tx.purchase.delete({ where: { id } });
    });

    revalidatePath("/dashboard/purchases");
    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete purchase." };
  }
}
