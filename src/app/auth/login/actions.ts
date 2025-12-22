"use server";

import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { cookies } from "next/headers"; // ✅ 1. เพิ่มบรรทัดนี้: เพื่อเรียกใช้ระบบ Cookie

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 1. Validation เบื้องต้น
  if (!email || !password) {
    return { error: "กรุณากรอกข้อมูลให้ครบถ้วน" };
  }

  try {
    // 2. ค้นหา User ใน Database
    const user = await db.user.findUnique({
      where: { email },
    });

    // 3. ถ้าไม่มี User
    if (!user) {
      return { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }; 
    }

    // 4. เช็ครหัสผ่าน
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
    }

    // ✅ 5. สร้าง Session/Cookie (แจกบัตรผ่าน)
    // นี่คือส่วนที่ขาดหายไปครับ
    const cookieStore = await cookies();
    
    // ตั้งชื่อ Cookie ว่า "token" (ให้ตรงกับที่ Middleware รอตรวจ)
    cookieStore.set("token", user.id, { 
      httpOnly: true, // ปลอดภัย: JavaScript ฝั่ง Client อ่านไม่ได้ (กันขโมย)
      secure: process.env.NODE_ENV === "production", // ใช้ HTTPS เท่านั้นถ้าขึ้น Production
      path: "/", // ใช้ได้ทุกหน้าในเว็บ
      maxAge: 60 * 60 * 24, // บัตรหมดอายุใน 1 วัน (วินาที)
    });

  } catch (error) {
    console.error("Login Error:", error);
    return { error: "เกิดข้อผิดพลาดของระบบ กรุณาลองใหม่" };
  }

  // 6. Redirect ไปหน้า Dashboard
  redirect("/dashboard"); 
}