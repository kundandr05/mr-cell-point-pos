"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function updateShopSettings(data: {
  name: string;
  gstin: string;
  address: string;
  phoneNumber: string;
  email: string;
}) {
  try {
    const shop = await prisma.shopSettings.findFirst();
    if (shop) {
      await prisma.shopSettings.update({
        where: { id: shop.id },
        data
      });
    } else {
      await prisma.shopSettings.create({
        data: { ...data, invoicePrefix: "MR" }
      });
    }
    
    // Revalidate paths that use these settings
    revalidatePath("/", "layout");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update settings:", error);
    return { success: false, error: "Failed to update settings." };
  }
}
