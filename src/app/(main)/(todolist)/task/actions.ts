"use server";

import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: Date;
  dueDate?: Date | string | null;
  userId: string;
}

export async function getAuthUser() {
  const user = await getUser();
  return user;
}

export async function getTasks(): Promise<Task[]> {
  const user = await getUser();
  if (!user) redirect("/auth/login");

  try {
    const tasks = await db.task.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
    return tasks as Task[]; 
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return [];
  }
}

// 1. สร้างงานใหม่
export async function createTask(formData: FormData) {
  const user = await getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const title = formData.get("title") as string;
  const dueDateString = formData.get("dueDate") as string;
  const priority = formData.get("priority") as string;

  if (!title || title.trim() === "") {
    return { success: false, error: "Task title is required." };
  }

  try {
    await db.task.create({
      data: {
        title,
        priority: (priority || "MEDIUM").toUpperCase(),
        status: "TODO", 
        dueDate: dueDateString ? new Date(dueDateString) : null,
        userId: user.id,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/task"); 
    return { success: true };
  } catch (error) {
    console.error("Create Task Error:", error);
    return { success: false, error: "Database error" };
  }
}

// 2. สลับสถานะ (Toggle Status) ✅ แก้ไขให้สมบูรณ์แล้ว
export async function toggleTaskStatus(taskId: string, currentStatus: string) {
  const user = await getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    // ตรวจสอบสถานะเดิม (แปลงเป็นตัวใหญ่เพื่อความชัวร์)
    // ถ้าสถานะเดิมคือ DONE ให้เปลี่ยนเป็น TODO
    // ถ้าสถานะเดิมไม่ใช่ DONE (เช่น TODO) ให้เปลี่ยนเป็น DONE
    const statusUpper = currentStatus.toUpperCase();
    const newStatus = statusUpper === "DONE" ? "TODO" : "DONE";

    await db.task.update({
      where: { id: taskId, userId: user.id },
      data: { status: newStatus }, // บันทึกค่าที่สลับแล้วลง DB
    });

    // สั่งให้ Next.js รีเฟรชข้อมูลในหน้าเหล่านี้ทันที
    revalidatePath("/dashboard");
    revalidatePath("/task");

    return { success: true };
  } catch (error) {
    console.error("Toggle Status Error:", error);
    return { success: false, error: "Failed to update status" };
  }
}

// 3. ลบงาน
export async function deleteTask(taskId: string) {
  const user = await getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    await db.task.delete({
      where: { id: taskId, userId: user.id },
    });

    revalidatePath("/dashboard");
    revalidatePath("/task");
    
    return { success: true };
  } catch (error) {
    console.error("Delete Task Error:", error);
    return { success: false, error: "Failed to delete task" };
  }
}