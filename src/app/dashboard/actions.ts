"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// --- ฟังก์ชัน Logout ---
export async function logout() {
  (await cookies()).delete("token");
  redirect("/");
}

// --- ฟังก์ชันดึง User ---
export async function getAuthUser() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  try {
    const user = await db.user.findUnique({
      where: { id: token },
      select: { 
        id: true,
        fullName: true, 
        email: true 
      }
    });
    return user;
  } catch (error) {
    console.error("Auth Error:", error);
    return null;
  }
}

// 🚀 [CREATE] ฟังก์ชันสร้าง Task
export async function createTask(formData: FormData) {
  const user = await getAuthUser();
  if (!user) return { error: "กรุณาล็อกอินก่อนทำรายการ" };

  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const priority = formData.get("priority")?.toString();

  if (!title || title.trim() === "") {
    return { error: "กรุณาระบุหัวข้อของงาน (Title)" };
  }

  try {
    await db.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        priority: priority?.toLowerCase() || "medium",
        userId: user.id,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Create Task Error:", error); 
    return { error: "ไม่สามารถบันทึกงานได้" };
  }
}

// 🔄 [UPDATE] ฟังก์ชันสลับสถานะงาน (ขีดฆ่า/ทำเสร็จ)
export async function toggleTaskStatus(taskId: string, currentStatus: string) {
  const user = await getAuthUser();
  if (!user) return { error: "Unauthorized" };

  try {
    const newStatus = currentStatus === "completed" ? "todo" : "completed";
    await db.task.update({
      where: { id: taskId, userId: user.id }, // ตรวจสอบความปลอดภัยว่าเจ้าของเป็นคนแก้เอง
      data: { status: newStatus },
    });
    
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Update Status Error:", error);
    return { error: "อัปเดตสถานะไม่สำเร็จ" };
  }
}

// 🗑️ [DELETE] ฟังก์ชันลบงาน
export async function deleteTask(taskId: string) {
  const user = await getAuthUser();
  if (!user) return { error: "Unauthorized" };

  try {
    await db.task.delete({
      where: { id: taskId, userId: user.id }, // ตรวจสอบความปลอดภัย
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Delete Task Error:", error);
    return { error: "ลบงานไม่สำเร็จ" };
  }
}