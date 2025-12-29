// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; 
import "./globals.css";
import { ThemeProvider } from "next-themes"; 
// ✅ 1. Import SessionProvider (ตรวจสอบ Path ของไฟล์ Provider ที่คุณสร้างไว้)
import { NextAuthProvider } from "@/providers/NextAuthProvider"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todolish",
  description: "Task Management App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning> 
      <body className={inter.className}>
        {/* ✅ 2. ล้อมด้วย NextAuthProvider (หรือ SessionProvider) เพิ่มเข้าไป */}
        <NextAuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}