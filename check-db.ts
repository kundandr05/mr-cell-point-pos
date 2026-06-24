import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const brands = await prisma.brand.count();
  const categories = await prisma.category.count();
  console.log(`Brands count: ${brands}`);
  console.log(`Categories count: ${categories}`);
}
main().finally(() => prisma.$disconnect());
