"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getProducts() {
  return await prisma.product.findMany({
    include: {
      brand: true,
      category: true,
      supplier: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductFormData() {
  const [brands, categories, suppliers] = await Promise.all([
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.supplier.findMany({ orderBy: { name: "asc" } }),
  ]);
  
  return { brands, categories, suppliers };
}

interface ProductInput {
  sku: string;
  barcode?: string | null;
  name: string;
  brandId: string;
  categoryId: string;
  supplierId?: string | null;
  hsnCode?: string | null;
  gstPercentage: string;
  purchasePrice: string;
  sellingPrice: string;
  stockQuantity: string;
  reorderLevel: string;
  warrantyPeriod?: string | null;
}

export async function createProduct(data: ProductInput) {
  try {
    const product = await prisma.product.create({
      data: {
        sku: data.sku,
        barcode: data.barcode || null,
        name: data.name,
        brandId: data.brandId,
        categoryId: data.categoryId,
        supplierId: data.supplierId || null,
        hsnCode: data.hsnCode || null,
        gstPercentage: parseFloat(data.gstPercentage),
        purchasePrice: parseFloat(data.purchasePrice),
        sellingPrice: parseFloat(data.sellingPrice),
        stockQuantity: parseInt(data.stockQuantity),
        reorderLevel: parseInt(data.reorderLevel),
        warrantyPeriod: data.warrantyPeriod || null,
      },
    });
    
    revalidatePath("/dashboard/products");
    return { success: true, product };
  } catch (error: unknown) {
    console.error("Failed to create product:", error);
    if (typeof error === "object" && error !== null && "code" in error && (error as {code: string}).code === "P2002") {
      return { success: false, error: "A product with this SKU or Barcode already exists." };
    }
    return { success: false, error: "Failed to create product." };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete product. It may be used in purchases or invoices." };
  }
}

export async function generateSkuAndBarcode() {
  // Generate a random 12 digit barcode
  const barcode = Math.floor(100000000000 + Math.random() * 900000000000).toString();
  // Generate a short SKU
  const sku = "PRD-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  
  return { sku, barcode };
}
