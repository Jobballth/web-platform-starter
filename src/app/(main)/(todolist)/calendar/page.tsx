import { db } from "@/lib/db";
import { getAuthUser } from "../dashboard/actions"; // เช็ค path ให้ถูกนะครับ
import { redirect } from "next/navigation";
import CalendarView from "@/components/calendar/CalendarView";

export const metadata = {
  title: "Calendar | Todolish",
  description: "View your tasks in a calendar view",
};

export default async function CalendarPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/");
  }

  // ดึงข้อมูล tasks ของ user นี้ทั้งหมด
  const tasks = await db.task.findMany({
    where: { 
      userId: user.id 
    },
    // เลือกเฉพาะ field ที่จำเป็นเพื่อความเร็ว
    select: {
      id: true,
      title: true,
      status: true,
      priority: true,
      dueDate: true,
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] p-6 lg:p-8 w-full">
      <div className="max-w-[1600px] mx-auto h-full">
        {/* ส่งข้อมูล tasks เข้าไปใน Component ปฏิทิน */}
        <CalendarView tasks={tasks} />
      </div>
    </div>
  );
}