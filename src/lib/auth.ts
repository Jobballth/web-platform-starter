// src/lib/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getServerSession, type NextAuthOptions, type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { compare } from "bcrypt";

// ✅ 1. Type Definitions
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"]
  }

  interface User {
    id: string;
    fullName?: string | null;
    // image?: string | null; // ตัดออกก่อนเพราะ DB คุณไม่มี
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

export const authOptions: NextAuthOptions = {
  debug: true, // เปิด debug ไว้ดู log
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, 
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error("User not found");
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        // ✅ แก้ Error 2: ตัด image ออก เพราะใน DB (User table) ของคุณไม่มีคอลัมน์นี้
        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          // image: user.image, <--- ลบทิ้ง เพราะ DB ไม่มี
        };
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function getUser() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return null;

    const user = await db.user.findUnique({
      where: { id: session.user.id }
    });

    return user;
  } catch (error) { 
    // ✅ แก้ Error 1: เรียกใช้ตัวแปร error เพื่อไม่ให้ฟ้อง unused-vars
    console.error("Login Error:", error); 
    return null;
  }
}