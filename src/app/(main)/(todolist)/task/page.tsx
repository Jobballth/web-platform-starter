import { Suspense } from "react";
import { db } from "@/lib/db";
import { getAuthUser } from "./actions";
import { redirect } from "next/navigation"; // ✅ เพิ่ม redirect
import CreateTaskModal from "@/components/todo/CreateTaskModal";
import { OverviewStats, OverviewStatsSkeleton } from "@/components/dashboard/OverviewStats";
import { RecentTasksContainer, RecentTasksSkeleton } from "@/components/dashboard/RecentTasksContainer";

interface PlainTask {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string | null;
  createdAt: string;
  userId: string;
}

const getCurrentDate = () => {
  return new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export default async function DashboardPage() {
  const user = await getAuthUser();

  // 🔒 Security Guard: ถ้าไม่ได้ Login ให้ดีดกลับหน้าแรกทันที
  if (!user) {
    redirect("/");
  }

  const tasks = await db.task.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const plainTasks: PlainTask[] = tasks.map(task => ({
    id: task.id,
    title: task.title,
    status: task.status,
    priority: task.priority,
    userId: task.userId,
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    createdAt: task.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] pb-20 relative overflow-hidden">
      {/* Background Pattern - แก้ไข Syntax bg-[size:...] */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[20px_20px] opacity-50 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                {getCurrentDate()}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
              Good Morning, <span className="bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                {user.fullName || 'User'}
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base max-w-lg">
              {"Here's what's happening with your projects today."}
            </p>
          </div>
          
          <div className="shrink-0">
             <CreateTaskModal />
          </div>
        </header>

        {/* ส่วนสถิติ */}
        <Suspense fallback={<OverviewStatsSkeleton />}>
           <OverviewStats userId={user.id} />
        </Suspense>

        {/* ส่วนรายการงาน */}
        <div className="mt-8">
          <Suspense fallback={<RecentTasksSkeleton />}>
             <RecentTasksContainer initialTasks={plainTasks} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}