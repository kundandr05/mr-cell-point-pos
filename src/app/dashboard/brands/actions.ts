"use server";

import { auth } from "@/auth";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getBrands() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  return await prisma.brand.findMany({
    orderBy: { name: 'asc' }
  });
}

export async function createBrand(name: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  try {
    const brand = await prisma.brand.create({
      data: { name },
    });
    revalidatePath("/dashboard", "layout");
    return { success: true, brand };
  } catch (error) {
    return { success: false, error: "Failed to create brand. Name might already exist." };
  }
}

export async function deleteBrand(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  try {
    await prisma.brand.delete({
      where: { id },
    });
    revalidatePath("/dashboard", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete brand." };
  }
}
