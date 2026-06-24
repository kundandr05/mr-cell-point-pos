import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const query = "Apple";
  try {
    const results = await prisma.product.findMany({
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
    console.log("Results:", results.length);
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
