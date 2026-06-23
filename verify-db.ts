import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const usersCount = await prisma.user.count();
    console.log('Successfully connected to the database.');
    console.log(`Users table exists. Current count: ${usersCount}`);
    
    const productsCount = await prisma.product.count();
    console.log(`Products table exists. Current count: ${productsCount}`);
    
  } catch (error) {
    console.error('Error connecting to the database or missing tables:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
