"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// ==========================================
// 🔐 ส่วนของ AUTHENTICATION (Login / Register)
// ==========================================

export async function login(formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "กรุณากรอกอีเมลและรหัสผ่าน" };
  }

  try {
    const user = await db.user.findUnique({ where: { email } });

    if (!user || user.password !== password) {
      return { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
    }

    const cookieStore = await cookies();
    cookieStore.set("token", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

  } catch {
    // ✅ ไม่ประกาศตัวแปร error
    return { error: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" };
  }

  redirect("/dashboard");
}

export async function register(formData: FormData) {
  const fullName = formData.get("fullName")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password || !fullName) {
    return { error: "กรุณากรอกข้อมูลให้ครบถ้วน" };
  }

  try {
    const existingUser = await db.user.findUnique({ where: { email } });

    if (existingUser) {
      return { error: "อีเมลนี้ถูกใช้งานแล้ว" };
    }

    const newUser = await db.user.create({
      data: { fullName, email, password },
    });

    const cookieStore = await cookies();
    cookieStore.set("token", newUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

  } catch {
    // ✅ ไม่ประกาศตัวแปร error
    return { error: "ไม่สามารถสร้างบัญชีได้" };
  }

  redirect("/dashboard");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  redirect("/");
}

export async function getAuthUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) return null;

    const user = await db.user.findUnique({
      where: { id: token },
      select: { id: true, fullName: true, email: true }
    });
    return user;
  } catch {
    // ✅ ไม่ประกาศตัวแปร error
    return null;
  }
}

// ==========================================
// 📝 ส่วนของ TASK MANAGEMENT
// ==========================================

export async function createTask(formData: FormData) {
  const user = await getAuthUser();
  if (!user) return { error: "กรุณาล็อกอินก่อนทำรายการ" };

  const title = formData.get("title")?.toString();
  const priority = formData.get("priority")?.toString();
  const dueDateStr = formData.get("dueDate")?.toString();

  if (!title || title.trim() === "") {
    return { error: "กรุณาระบุหัวข้อของงาน (Title)" };
  }

  try {
    await db.task.create({
      data: {
        title: title.trim(),
        priority: priority?.toLowerCase() || "medium",
        dueDate: dueDateStr ? new Date(dueDateStr) : null,
        status: "todo",
        userId: user.id,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    // ✅ ไม่ประกาศตัวแปร error
    return { error: "ไม่สามารถบันทึกงานได้" };
  }
}

export async function toggleTaskStatus(taskId: string, currentStatus: string) {
  const user = await getAuthUser();
  if (!user) return { error: "Unauthorized" };

  try {
    const newStatus = currentStatus === "completed" ? "todo" : "completed";
    
    await db.task.update({
      where: { id: taskId, userId: user.id }, 
      data: { status: newStatus },
    });
    
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    // ✅ ไม่ประกาศตัวแปร error
    return { error: "อัปเดตสถานะไม่สำเร็จ" };
  }
}

export async function deleteTask(taskId: string) {
  const user = await getAuthUser();
  if (!user) return { error: "Unauthorized" };

  try {
    await db.task.delete({
      where: { id: taskId, userId: user.id }, 
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    // ✅ ไม่ประกาศตัวแปร error
    return { error: "ลบงานไม่สำเร็จ" };
  }
}