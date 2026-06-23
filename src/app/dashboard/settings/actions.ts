"use server";

import { auth } from "@/auth";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getShopSettings() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const settings = await prisma.shopSettings.findFirst();
  return settings;
}

export type ShopSettingsInput = {
  name: string;
  gstin: string;
  address: string;
  phoneNumber: string;
  email: string;
  invoicePrefix: string;
  invoiceFooter?: string;
};

export async function updateShopSettings(data: ShopSettingsInput) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  try {
    const existingSettings = await prisma.shopSettings.findFirst();
    
    if (existingSettings) {
      await prisma.shopSettings.update({
        where: { id: existingSettings.id },
        data,
      });
    } else {
      await prisma.shopSettings.create({
        data,
      });
    }
    
    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to save shop settings." };
  }
}
