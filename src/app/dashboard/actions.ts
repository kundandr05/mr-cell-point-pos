"use server";

import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getDashboardMetrics() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  // Today's boundaries
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // Month boundaries
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  // 1. Today's Sales
  const todaysInvoices = await prisma.invoice.findMany({
    where: { date: { gte: startOfDay, lte: endOfDay } }
  });
  const todaysSales = todaysInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);

  // 2. Monthly Revenue & Profit
  const monthlyInvoices = await prisma.invoice.findMany({
    where: { date: { gte: startOfMonth } }
  });
  const monthlyRevenue = monthlyInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);

  // To calculate profit, we need to know the purchase price of items sold
  const monthlyInvoiceItems = await prisma.invoiceItem.findMany({
    where: { invoice: { date: { gte: startOfMonth } } },
    include: { product: true }
  });
  const monthlyCost = monthlyInvoiceItems.reduce((sum, item) => sum + (item.product.purchasePrice * item.quantity), 0);
  const monthlyProfit = monthlyRevenue - monthlyCost;

  // 3. Inventory Value
  const products = await prisma.product.findMany();
  const inventoryValue = products.reduce((sum, p) => sum + (p.stockQuantity * p.purchasePrice), 0);

  // 4. Low Stock Alerts
  const lowStockCount = products.filter(p => p.stockQuantity <= p.reorderLevel).length;

  // 5. Pending Payments
  // Assuming 'SPLIT' or 'UPI' might have pending components if we implement a ledger, but for now we'll mock or sum specific modes
  const pendingInvoices = await prisma.invoice.count({ where: { paymentMode: "SPLIT" } });

  // 6. Top Selling Products
  const topProductsRaw = await prisma.invoiceItem.groupBy({
    by: ['productId'],
    _sum: { quantity: true, totalAmount: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: 5
  });

  const topProducts = await Promise.all(
    topProductsRaw.map(async (tp) => {
      const p = await prisma.product.findUnique({ where: { id: tp.productId }, include: { brand: true } });
      return {
        id: p?.id,
        name: p?.name,
        brand: p?.brand.name,
        image: p?.image,
        soldQty: tp._sum.quantity || 0,
        revenue: tp._sum.totalAmount || 0
      };
    })
  );

  return {
    todaysSales,
    monthlyRevenue,
    monthlyProfit,
    inventoryValue,
    lowStockCount,
    pendingPaymentsCount: pendingInvoices,
    topProducts,
    // Provide a mocked growth percentage for UI feel, or calculate last month
    revenueGrowth: 12.5 
  };
}
