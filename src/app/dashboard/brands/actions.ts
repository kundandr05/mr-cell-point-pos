"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getBrands() {
  return await prisma.brand.findMany({
    orderBy: { name: 'asc' }
  });
}

export async function createBrand(name: string) {
  try {
    const brand = await prisma.brand.create({
      data: { name },
    });
    revalidatePath("/dashboard/brands");
    return { success: true, brand };
  } catch (error) {
    return { success: false, error: "Failed to create brand. Name might already exist." };
  }
}

export async function deleteBrand(id: string) {
  try {
    await prisma.brand.delete({
      where: { id },
    });
    revalidatePath("/dashboard/brands");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete brand." };
  }
}
