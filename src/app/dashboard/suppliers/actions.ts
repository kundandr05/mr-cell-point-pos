"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getSuppliers() {
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
