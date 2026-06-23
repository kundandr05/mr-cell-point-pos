"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: (error as any).type === "CredentialsSignin" && (error as any).cause?.err?.code ? (error as any).cause.err.code : "Invalid credentials." };
        case "CallbackRouteError":
          return { error: (error as any).cause?.err?.code || "Invalid credentials." };
        default:
          return { error: (error as any).cause?.err?.code || "Something went wrong." };
      }
    }
    throw error;
  }
}
