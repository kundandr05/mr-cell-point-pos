"use server";

import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getReportsData() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const now = new Date();
  
  // Last 30 Days Sales Trend
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);
  
  const recentInvoices = await prisma.invoice.findMany({
    where: { date: { gte: thirtyDaysAgo } },
    select: { date: true, grandTotal: true }
  });

  // Group by day string "MMM DD"
  const dailyData: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    dailyData[d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })] = 0;
  }

  recentInvoices.forEach(inv => {
    const dateStr = inv.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (dailyData[dateStr] !== undefined) {
      dailyData[dateStr] += inv.grandTotal;
    }
  });

  const salesTrend = Object.entries(dailyData).map(([date, revenue]) => ({ date, revenue }));

  // Profit calculations
  // Simplified for performance: total revenue minus total cost of items sold in this period
  const recentItems = await prisma.invoiceItem.findMany({
    where: { invoice: { date: { gte: thirtyDaysAgo } } },
    include: { product: true }
  });
  
  const totalRevenue = recentInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalCost = recentItems.reduce((sum, item) => sum + (item.product.purchasePrice * item.quantity), 0);
  const totalProfit = totalRevenue - totalCost;

  // Fast moving products
  const productSalesRaw = await prisma.invoiceItem.groupBy({
    by: ['productId'],
    _sum: { quantity: true, totalAmount: true },
    where: { invoice: { date: { gte: thirtyDaysAgo } } }
  });

  const productData = await Promise.all(
    productSalesRaw.map(async (ps) => {
      const p = await prisma.product.findUnique({ where: { id: ps.productId }, select: { name: true, sku: true, stockQuantity: true } });
      return {
        name: p?.name || 'Unknown',
        sku: p?.sku || '-',
        sold: ps._sum.quantity || 0,
        revenue: ps._sum.totalAmount || 0,
        stock: p?.stockQuantity || 0
      };
    })
  );

  const fastMoving = [...productData].sort((a, b) => b.sold - a.sold).slice(0, 5);
  const slowMoving = [...productData].sort((a, b) => a.sold - b.sold).slice(0, 5);

  return {
    salesTrend,
    totalRevenue,
    totalProfit,
    fastMoving,
    slowMoving
  };
}
