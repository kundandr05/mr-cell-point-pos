import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { RegisterForm } from "./register-form";

const prisma = new PrismaClient();

export default async function RegisterPage() {
  const totalUsers = await prisma.user.count();

  if (totalUsers > 0) {
    redirect("/login");
  }

  return <RegisterForm />;
}
