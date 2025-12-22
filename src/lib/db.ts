import { PrismaClient } from '@prisma/client';

// ใช้ globalThis แทน global เพื่อความแม่นยำของระบบ Type ในรุ่นใหม่ๆ
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const db = // เปลี่ยนชื่อจาก prisma เป็น db
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'], // แสดงคำสั่ง SQL ใน Terminal (ตัวนี้ช่วยให้คุณเห็น SQL ที่ส่งไป Postgres)
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;