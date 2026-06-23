"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });
}

export async function createCategory(name: string) {
  try {
    const category = await prisma.category.create({
      data: { name },
    });
    revalidatePath("/dashboard/categories");
    return { success: true, category };
  } catch (error) {
    return { success: false, error: "Failed to create category. Name might already exist." };
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id },
    });
    revalidatePath("/dashboard/categories");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete category." };
  }
}
