import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';

export async function GET() {
  try {
    // 1. ลองสร้าง User ใหม่
    const newUser = await prisma.user.create({
      data: {
        // ใช้ Date.now() เพื่อให้ Email ไม่ซ้ำกันเวลากด Refresh หลายรอบ
        email: `test-${Date.now()}@example.com`, 
        name: 'Test User From API',
      },
    });

    // 2. ส่งข้อมูลกลับไปที่หน้าเว็บ
    return NextResponse.json({
      success: true,
      message: 'เย้! เชื่อมต่อ Database สำเร็จแล้ว',
      data: newUser,
    });

  } catch (error) {
    console.error(error); // ปริ้น Error ลง Terminal เผื่อดู
    return NextResponse.json(
      { success: false, error: 'เชื่อมต่อ Database ไม่ได้' },
      { status: 500 }
    );
  }
}