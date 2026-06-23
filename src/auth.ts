import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        console.log("Login attempt:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        console.log("User found:", !!user);

        if (!user || !user.password) {
          console.log("No user or password");
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        console.log("Password valid:", isPasswordValid);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});