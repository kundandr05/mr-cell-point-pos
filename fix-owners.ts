import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const updated = await prisma.user.updateMany({
      where: { role: "OWNER" },
      data: { isApproved: true },
    });
    console.log(`Successfully approved ${updated.count} OWNER accounts.`);
  } catch (error) {
    console.error("Failed to update users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
