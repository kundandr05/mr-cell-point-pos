"use server";

import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getInvoices() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const invoices = await prisma.invoice.findMany({
    orderBy: { date: 'desc' },
    include: {
      items: true
    }
  });
  
  return invoices;
}
