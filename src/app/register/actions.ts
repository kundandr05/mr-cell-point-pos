"use server";

import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function registerAction(data: { name: string; email: string; password?: string }) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { success: false, error: "A user with this email already exists." };
    }

    // Determine role and approval status based on total user count
    const totalUsers = await prisma.user.count();

    if (totalUsers > 0) {
      return { success: false, error: "An admin account already exists. Only one account is permitted." };
    }

    const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : undefined;

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: Role.OWNER,
      },
    });

    return { success: true, message: "Admin account created successfully! You can now log in." };
  } catch (error) {
    console.error("Failed to register user:", error);
    return { success: false, error: "Failed to create user. Please try again." };
  }
}
