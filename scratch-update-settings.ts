import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const shop = await prisma.shopSettings.findFirst();

  const data = {
    name: "MR Cell Point",
    gstin: "29AUZPM3464D1Z1",
    address: "C.N. Road, Bhadravathi - 577301",
    phoneNumber: "+91 9999999999",
    email: "contact@mrcellpoint.in",
    invoicePrefix: "MR",
    logoUrl: "/logo.jpg",
  };

  if (shop) {
    await prisma.shopSettings.update({
      where: { id: shop.id },
      data,
    });
    console.log("Updated existing ShopSettings.");
  } else {
    await prisma.shopSettings.create({ data });
    console.log("Created new ShopSettings.");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
