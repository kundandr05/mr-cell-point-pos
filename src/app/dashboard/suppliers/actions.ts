"use server";

import { auth } from "@/auth";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getSuppliers() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  return await prisma.supplier.findMany({
    orderBy: { name: 'asc' }
  });
}

export type SupplierInput = {
  name: string;
  suppliedItem?: string;
  gstin?: string;
  contactPerson?: string;
  phoneNumber?: string;
  address?: string;
  paymentTerms?: string;
};

export async function createSupplier(data: SupplierInput) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  try {
    const supplier = await prisma.supplier.create({
      data,
    });
    revalidatePath("/dashboard/suppliers");
    return { success: true, supplier };
  } catch (error) {
    return { success: false, error: "Failed to create supplier." };
  }
}

export async function deleteSupplier(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  try {
    await prisma.supplier.delete({
      where: { id },
    });
    revalidatePath("/dashboard/suppliers");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete supplier." };
  }
}
