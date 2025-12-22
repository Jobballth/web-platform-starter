// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; 
import "./globals.css";
// ✅ 1. Import ThemeProvider
import { ThemeProvider } from "next-themes"; 

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
    // ✅ 2. เพิ่ม suppressHydrationWarning เพื่อป้องกัน Error เรื่องสีตอนโหลดหน้าเว็บ
    <html lang="en" suppressHydrationWarning> 
      <body className={inter.className}>
        {/* ✅ 3. ล้อม children ด้วย ThemeProvider และระบุ attribute="class" */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}