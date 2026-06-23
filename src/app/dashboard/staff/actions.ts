"use server";

import { auth } from "@/auth";
import { PrismaClient, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function createStaff(data: { name: string; email: string; password?: string; role: Role }) {
  const session = await auth();
  if (!session || session.user?.role !== "OWNER") {
    return { success: false, error: "Unauthorized. Only Owners can create staff accounts." };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { success: false, error: "A user with this email already exists." };
    }

    const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : undefined;

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
    });

    revalidatePath("/dashboard/staff");
    return { success: true, user };
  } catch (error) {
    console.error("Failed to create user:", error);
    return { success: false, error: "Failed to create user." };
  }
}

export async function deleteStaff(id: string) {
  const session = await auth();
  if (!session || session.user?.role !== "OWNER") {
    return { success: false, error: "Unauthorized" };
  }

  // Prevent deleting yourself
  if (session.user.id === id) {
    return { success: false, error: "You cannot delete your own account." };
  }

  try {
    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/dashboard/staff");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { success: false, error: "Failed to delete user." };
  }
}

export async function approveStaff(id: string) {
  const session = await auth();
  if (!session || session.user?.role !== "OWNER") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.user.update({
      where: { id },
      data: { isApproved: true },
    });

    revalidatePath("/dashboard/staff");
    return { success: true };
  } catch (error) {
    console.error("Failed to approve user:", error);
    return { success: false, error: "Failed to approve user." };
  }
}
