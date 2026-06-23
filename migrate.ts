import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Executing raw SQL to add isApproved column...");
    await prisma.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN "isApproved" BOOLEAN NOT NULL DEFAULT false;');
    console.log("Successfully added isApproved column!");
  } catch (error: any) {
    // If it already exists, it will throw an error, which we can ignore
    if (error.message && error.message.includes("already exists")) {
      console.log("Column already exists. Database is up to date.");
    } else {
      console.error("Failed to execute SQL:", error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
