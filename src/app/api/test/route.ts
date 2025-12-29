import { NextResponse } from 'next/server';
// 1. นำเข้า db จาก lib/db (ตรวจสอบ path ให้ถูกต้องตามโครงสร้างโปรเจกต์คุณ)
import { db } from '@/lib/db'; 

// 🟢 1. GET: ดึงข้อมูลผู้ใช้ทั้งหมด
export async function GET() {
  try {
    const users = await db.user.findMany({
      orderBy: { createdAt: 'desc' } 
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error occurred:', error);
    return NextResponse.json({ error: 'ดึงข้อมูลไม่สำเร็จ' }, { status: 500 });
  }
}

// 🔵 2. POST: สร้างผู้ใช้ใหม่
export async function POST(request: Request) {
  try {
    const body = await request.json(); 
    
    // แกะค่าจาก body ให้ตรงกับที่ Prisma ต้องการ (fullName และ password)
    const { email, fullName, password } = body;

    // ตรวจสอบเบื้องต้นว่าส่งค่าที่จำเป็นมาครบไหม
    if (!email || !password) {
      return NextResponse.json({ error: 'กรุณากรอก email และ password' }, { status: 400 });
    }

    const newUser = await db.user.create({
      data: {
        email,    
        fullName, // ใช้ชื่อให้ตรงกับ Schema
        password, // บังคับใส่ตามกฎใน Schema
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error occurred:', error);
    return NextResponse.json({ error: 'สร้างผู้ใช้ไม่สำเร็จ' }, { status: 500 });
  }
}

// 🔴 3. DELETE: ลบผู้ใช้
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ต้องระบุ ID ที่ต้องการลบ' }, { status: 400 });
    }

    await db.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error occurred:', error);
    return NextResponse.json({ error: 'ลบข้อมูลไม่สำเร็จ' }, { status: 500 });
  }
}