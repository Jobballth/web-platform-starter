import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db'; // เรียกใช้ prisma ที่คุณตั้งค่าไว้

// 1. GET: ดึงข้อมูลผู้ใช้ทั้งหมด
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' } // เรียงจากใหม่ไปเก่า
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error occurred:', error); // 👈 เพิ่มบรรทัดนี้: เรียกใช้ตัวแปร error เพื่อแสดงผล
    return NextResponse.json({ error: 'ดึงข้อมูลไม่สำเร็จ' }, { status: 500 });
  }
}

// 2. POST: สร้างผู้ใช้ใหม่ (รับค่าจากหน้าเว็บ)
export async function POST(request: Request) {
  try {
    const body = await request.json(); // อ่านข้อมูลที่ส่งมาจากหน้าเว็บ
    const { email, name } = body;

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error occurred:', error); // 👈 เพิ่มบรรทัดนี้: เรียกใช้ตัวแปร error เพื่อแสดงผล
    return NextResponse.json({ error: 'ดึงข้อมูลไม่สำเร็จ' }, { status: 500 });
  }
}

// 3. DELETE: ลบผู้ใช้ (รับค่า ID มาเพื่อลบ)
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json(); // อ่าน ID ที่ส่งมาจากหน้าเว็บ

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'ลบข้อมูลไม่สำเร็จ' }, { status: 500 });
  }
}