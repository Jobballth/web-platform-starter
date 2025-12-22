"use server"; // สำคัญมาก: ต้องมีบรรทัดนี้เพื่อให้รันบน Server ได้

import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export async function registerUser(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 1. ตรวจสอบข้อมูลเบื้องต้น
  if (!email || !password) {
    return { error: "กรุณากรอกข้อมูลให้ครบถ้วน" };
  }

  try {
    // 2. เช็คว่ามีอีเมลนี้ในระบบหรือยัง
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "อีเมลนี้ถูกใช้งานแล้ว" };
    }

    // 3. เข้ารหัสลับ Password (Security First!)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. บันทึกลง PostgreSQL (Docker) ของคุณ
    await db.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
      },
    });

  } catch (error) {
    console.error("Register Error:", error);
    return { error: "เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล" };
  }

  // 5. เมื่อสำเร็จ ส่งไปหน้า Login
  redirect("/auth/login");
}