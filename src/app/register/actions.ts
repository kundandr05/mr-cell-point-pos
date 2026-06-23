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
    const isFirstUser = totalUsers === 0;

    const role = isFirstUser ? Role.OWNER : Role.STAFF;
    const isApproved = isFirstUser ? true : false;

    const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : undefined;

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: role,
        isApproved: isApproved,
      },
    });

    if (isFirstUser) {
      return { success: true, message: "Admin account created successfully! You can now log in." };
    } else {
      return { success: true, message: "Registration successful! Please wait for the admin to approve your account before logging in." };
    }
  } catch (error) {
    console.error("Failed to register user:", error);
    return { success: false, error: "Failed to create user. Please try again." };
  }
}
