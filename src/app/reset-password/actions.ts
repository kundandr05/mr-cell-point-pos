"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function resetPasswordAction(formData: FormData) {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;

  if (!token || !password) {
    return { success: false, error: "Missing token or password." };
  }

  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters long." };
  }

  try {
    const resetToken = await prisma.resetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      return { success: false, error: "Invalid or expired reset token." };
    }

    if (new Date() > resetToken.expiresAt) {
      await prisma.resetToken.delete({ where: { id: resetToken.id } });
      return { success: false, error: "Reset token has expired." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user and delete token in a transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),
      prisma.resetToken.deleteMany({
        where: { userId: resetToken.userId },
      })
    ]);

    return { success: true, message: "Password reset successfully. You can now log in." };
  } catch (error) {
    console.error("Reset password error:", error);
    return { success: false, error: "Failed to reset password." };
  }
}
