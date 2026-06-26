"use server";

import { auth } from "@/auth";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function searchProducts(query: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  if (!query) return [];
  
  return await prisma.product.findMany({
    where: {
      OR: [
        { barcode: { equals: query } },
        { sku: { contains: query, mode: 'insensitive' } },
        { name: { contains: query, mode: 'insensitive' } },
        { brand: { name: { contains: query, mode: 'insensitive' } } },
        { category: { name: { contains: query, mode: 'insensitive' } } },
      ]
    },
    take: 10,
    include: {
      brand: true,
      category: true,
    }
  });
}

export async function searchCustomers(query: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  if (!query) return [];

  return await prisma.customer.findMany({
    where: {
      phone: { contains: query }
    },
    take: 5,
    orderBy: {
      createdAt: 'desc'
    }
  });
}

interface InvoiceItemInput {
  productId: string;
  quantity: number;
  rate: number;
  gstPercent: number;
  discount: number;
  gstAmount: number;
  totalAmount: number;
}

interface InvoiceInput {
  customerName?: string;
  customerPhone?: string;
  paymentMode: "CASH" | "UPI" | "CARD" | "SPLIT";
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  grandTotal: number;
  discount?: number;
  items: InvoiceItemInput[];
}

export async function createInvoice(data: InvoiceInput) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  try {
    const settings = await prisma.shopSettings.findFirst();
    const prefix = settings?.invoicePrefix || "INV-";
    
    const result = await prisma.$transaction(async (tx) => {
      // Get next invoice number
      const count = await tx.invoice.count();
      const invoiceNumber = `${prefix}${(count + 1).toString().padStart(6, '0')}`;
      
      // Handle customer auto-creation or linking
      let customerId = null;
      if (data.customerPhone) {
        // Try to find existing customer by phone
        let customer = await tx.customer.findUnique({
          where: { phone: data.customerPhone }
        });
        
        // If no customer exists, create one automatically
        if (!customer && data.customerName) {
          customer = await tx.customer.create({
            data: {
              name: data.customerName,
              phone: data.customerPhone,
            }
          });
        }
        
        if (customer) {
          customerId = customer.id;
        }
      }
      
      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          customerId,
          customerName: data.customerName || null,
          customerPhone: data.customerPhone || null,
          paymentMode: data.paymentMode,
          subtotal: data.subtotal,
          cgst: data.cgst,
          sgst: data.sgst,
          igst: data.igst,
          grandTotal: data.grandTotal,
          discount: data.discount || 0,
          items: {
            create: data.items.map((item: InvoiceItemInput) => ({
              productId: item.productId,
              quantity: item.quantity,
              rate: item.rate,
              gstPercent: item.gstPercent,
              discount: item.discount,
              gstAmount: item.gstAmount,
              totalAmount: item.totalAmount,
            }))
          }
        }
      });

      // Reduce inventory
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: item.quantity
            }
          }
        });
      }

      return invoice;
    });

    revalidatePath("/dashboard/billing");
    revalidatePath("/dashboard/invoices");
    revalidatePath("/dashboard/products");
    
    return { success: true, invoiceId: result.id };
  } catch (error) {
    console.error("Failed to create invoice:", error);
    return { success: false, error: "Failed to generate invoice." };
  }
}
