"use server";

import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- Existing Functions (Keep these) ---

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
        priority: priority || "medium",
        status: "todo", 
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

// --- ✅ NEW FUNCTIONS TO FIX YOUR ERROR ---

// 1. Toggle Task Status
export async function toggleTaskStatus(taskId: string, currentStatus: string) {
  const user = await getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    // Logic: If currently "completed", switch to "todo", otherwise "completed"
    // (This matches the check in your RecentTasksContainer: task.status === "completed")
    const newStatus = currentStatus === "completed" ? "todo" : "completed";

    await db.task.update({
      where: { 
        id: taskId,
        userId: user.id // Security check: ensure user owns the task
      },
      data: { status: newStatus },
    });

    // Refresh UI
    revalidatePath("/dashboard");
    revalidatePath("/task");
    
    return { success: true };
  } catch (error) {
    console.error("Toggle Status Error:", error);
    return { success: false, error: "Failed to update status" };
  }
}

// 2. Delete Task
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