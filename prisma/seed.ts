import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultBrands = [
  "Apple", "Samsung", "Boat", "JBL", "Realme", "Xiaomi", 
  "OnePlus", "Oppo", "Vivo", "Noise", "Sony", "Portronics", 
  "Ambrane", "Syska", "Anker"
];

const defaultCategories = [
  "Chargers", "USB Cables", "Earphones", "Neckbands", 
  "Bluetooth Speakers", "Power Banks", "Mobile Cases", 
  "Tempered Glass", "Smart Watches", "Memory Cards", 
  "Mobile Holders", "Adapters", "Car Chargers", 
  "Data Cables", "Accessories"
];

async function main() {
  console.log("Starting seed process...");

  // Seed Brands
  for (const brandName of defaultBrands) {
    await prisma.brand.upsert({
      where: { name: brandName },
      update: {}, // Do nothing if it exists
      create: {
        name: brandName,
        isActive: true,
      },
    });
    console.log(`Upserted Brand: ${brandName}`);
  }

  // Seed Categories
  for (const categoryName of defaultCategories) {
    await prisma.category.upsert({
      where: { name: categoryName },
      update: {}, // Do nothing if it exists
      create: {
        name: categoryName,
        isActive: true,
      },
    });
    console.log(`Upserted Category: ${categoryName}`);
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
