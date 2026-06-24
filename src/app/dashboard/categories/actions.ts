"use server";

import { auth } from "@/auth";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getCategories() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  return await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });
}

export async function createCategory(name: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  try {
    const category = await prisma.category.create({
      data: { name },
    });
    revalidatePath("/dashboard", "layout");
    revalidatePath("/dashboard/products");
    return { success: true, category };
  } catch (error) {
    return { success: false, error: "Failed to create category. Name might already exist." };
  }
}

export async function toggleCategoryStatus(id: string, isActive: boolean) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  try {
    const category = await prisma.category.update({
      where: { id },
      data: { isActive }
    });
    revalidatePath("/dashboard", "layout");
    revalidatePath("/dashboard/products");
    return { success: true, category };
  } catch (error) {
    return { success: false, error: "Failed to update category status." };
  }
}

export async function editCategory(id: string, name: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  if (!name.trim()) return { success: false, error: "Category name is required." };

  try {
    const category = await prisma.category.update({
      where: { id },
      data: { name },
    });
    revalidatePath("/dashboard", "layout");
    revalidatePath("/dashboard/products");
    return { success: true, category };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: "A category with this name already exists." };
    }
    return { success: false, error: "Failed to edit category." };
  }
}

export async function deleteCategory(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  try {
    await prisma.category.delete({
      where: { id },
    });
    revalidatePath("/dashboard", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete category." };
  }
}
