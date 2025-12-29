import { PrismaClient } from '@prisma/client';

// 1. ประกาศตัวแปร globalForPrisma ไว้ที่นี่ (ห้ามลืม!)
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

// 2. สร้างตัวแปร db (หรือชื่อที่คุณเลือก)
export const db = 
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'], 
  });

// 3. ตรวจสอบชื่อบรรทัดนี้ให้ตรงกับบรรทัดที่ 1 (ต้องไม่มีตัวพิมพ์เล็ก/ใหญ่ผิด)
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;