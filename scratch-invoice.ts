import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const inv = await prisma.invoice.findFirst();
  console.log(inv);
}
main().finally(() => prisma.$disconnect());
