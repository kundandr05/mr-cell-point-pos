"use server";

import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { success: false, error: "Email is required." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return success even if user not found to prevent email enumeration
      return { success: true, message: "If that email exists, a reset link has been generated." };
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.resetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // In production with an email provider, we would send an email here.
    // For this system without email configured, we return the link directly.
    // Normally, getting the origin would be done via headers() or env variables.
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    return { 
      success: true, 
      message: "Reset link generated successfully.",
      resetLink 
    };
  } catch (error) {
    console.error("Forgot password error:", error);
    return { success: false, error: "Failed to process request." };
  }
}
