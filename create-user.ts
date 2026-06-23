import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'waseemguddu9@gmail.com';
  const password = '123456789';
  
  const existingUser = await prisma.user.findUnique({ where: { email } });
  
  if (existingUser) {
    console.log('User already exists!');
    return;
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = await prisma.user.create({
    data: {
      email,
      name: 'Waseem Guddu',
      password: hashedPassword,
      role: Role.OWNER,
    },
  });
  
  console.log('Successfully registered account: ' + user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
