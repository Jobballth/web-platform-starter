"use server";

import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- Existing Functions ---

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
  
  if (!user) {
    redirect("/auth/login");
  }

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

// ✅ แก้ไข 1: สร้างงานใหม่ให้เป็นตัวพิมพ์ใหญ่ (TODO)
export async function createTask(formData: FormData) {
  const user = await getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

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
        // ✅ บังคับเป็นตัวใหญ่ (MEDIUM/HIGH/LOW)
        priority: (priority || "MEDIUM").toUpperCase(), 
        // ✅ บังคับเป็นตัวใหญ่ (TODO) เพื่อให้กราฟนับค่าถูก
        status: "TODO", 
        dueDate: dueDateString ? new Date(dueDateString) : null,
        userId: user.id,
      },
    });

    // สั่งรีเฟรชทั้ง 2 หน้า
    revalidatePath("/dashboard");
    revalidatePath("/task"); 
    return { success: true };
  } catch (error) {
    console.error("Create Task Error:", error);
    return { success: false, error: "Database error" };
  }
}

// --- ✅ NEW FUNCTIONS (FIXED) ---

// ✅ แก้ไข 2: สลับสถานะโดยใช้ DONE/TODO (ตัวใหญ่)
export async function toggleTaskStatus(taskId: string, currentStatus: string) {
  const user = await getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    // แปลงเป็นตัวใหญ่ก่อนเช็ค เพื่อความชัวร์
    const statusUpper = currentStatus.toUpperCase();
    
    // Logic: ถ้าเป็น DONE ให้กลับไป TODO, ถ้าไม่ใช่ (เช่น TODO หรือ IN_PROGRESS) ให้เป็น DONE
    const newStatus = statusUpper === "DONE" ? "TODO" : "DONE";

    await db.task.update({
      where: { 
        id: taskId,
        userId: user.id 
      },
      data: { status: newStatus },
    });

    // ✅ Refresh UI: สั่งให้หน้า Dashboard และ Task โหลดข้อมูลใหม่ทันที
    revalidatePath("/dashboard");
    revalidatePath("/task");
    
    return { success: true };
  } catch (error) {
    console.error("Toggle Status Error:", error);
    return { success: false, error: "Failed to update status" };
  }
}

// 3. Delete Task (อันนี้ถูกต้องแล้ว)
export async function deleteTask(taskId: string) {
  const user = await getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    await db.task.delete({
      where: { 
        id: taskId,
        userId: user.id 
      },
    });

    // Refresh UI
    revalidatePath("/dashboard");
    revalidatePath("/task");
    
    return { success: true };
  } catch (error) {
    console.error("Delete Task Error:", error);
    return { success: false, error: "Failed to delete task" };
  }
}