"use server";

import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function updateSecuritySettings(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const currentPassword = formData.get("currentPassword") as string;
  const newEmail = formData.get("newEmail") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!currentPassword) {
    return { success: false, error: "Current password is required." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || !user.password) {
      return { success: false, error: "User not found." };
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return { success: false, error: "Incorrect current password." };
    }

    const updates: any = {};
    if (newEmail && newEmail !== user.email) {
      updates.email = newEmail;
    }
    if (newPassword && newPassword.length >= 6) {
      updates.password = await bcrypt.hash(newPassword, 10);
    }

    if (Object.keys(updates).length > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: updates,
      });
      return { success: true, message: "Security settings updated successfully!" };
    }

    return { success: true, message: "No changes were made." };
  } catch (error) {
    console.error("Failed to update security settings:", error);
    return { success: false, error: "Failed to update settings. Email might be in use." };
  }
}
