import { db } from "@/lib/db";
import { getAuthUser } from "./actions"; 
import { redirect } from "next/navigation";
import { StatsCards } from "@/components/dashboard/StatsCards"; 
import DashboardCharts from "@/components/dashboard/DashboardCharts"; 

// ฟังก์ชันดึงวันที่ปัจจุบัน
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

  if (!user) {
    redirect("/");
  }

  // 1. ดึงข้อมูล tasks ทั้งหมด
  const tasks = await db.task.findMany({
    where: { userId: user.id },
  });

  // 2. ✅ แก้ไข: เตรียมข้อมูลส่งกราฟ (Normalization)
  // ปรับค่า Status ให้เป็นมาตรฐานเดียวกัน (DONE) ก่อนส่งไปให้กราฟวาด
  const plainTasks = tasks.map((task) => {
    const s = task.status ? task.status.toUpperCase() : "TODO";
    // ถ้าเจอคำว่า DONE หรือ COMPLETED ให้ถือว่าเป็น "DONE" ให้หมด
    const normalizedStatus = (s === "DONE" || s === "COMPLETED") ? "DONE" : s;
    
    return {
      id: task.id,
      priority: task.priority.toUpperCase(),
      status: normalizedStatus, 
    };
  });

  // 3. ✅ แก้ไข: สูตรคำนวณ StatsCards ให้แม่นยำที่สุด
  const stats = {
    total: tasks.length,
    
    // นับงานเสร็จ: เช็คทั้ง "DONE" และ "COMPLETED"
    completed: tasks.filter(t => {
      const s = t.status ? t.status.toUpperCase() : "";
      return s === "DONE" || s === "COMPLETED";
    }).length,
    
    // นับงานค้าง: คืออันที่ไม่ใช่งานเสร็จ
    pending: tasks.filter(t => {
      const s = t.status ? t.status.toUpperCase() : "";
      return s !== "DONE" && s !== "COMPLETED";
    }).length,
    
    // นับงานด่วนที่ยังไม่เสร็จ
    highPriority: tasks.filter(t => {
      const s = t.status ? t.status.toUpperCase() : "";
      const p = t.priority ? t.priority.toUpperCase() : "";
      return p === "HIGH" && (s !== "DONE" && s !== "COMPLETED");
    }).length
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] pb-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-size-[20px_20px] opacity-50 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                {getCurrentDate()}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
              Welcome back,{" "}
              <span className="bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                {user.fullName || 'User'}
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base">
              {"Here's a summary of your workspace performance."}
            </p>
          </div>
        </header>

        {/* --- STATS CARDS --- */}
        <div className="animate-in fade-in zoom-in duration-500 delay-100">
           <StatsCards 
             total={stats.total}
             completed={stats.completed}
             pending={stats.pending}
             overdue={stats.highPriority}
           />
        </div>

        {/* --- CHARTS --- */}
        <div className="mt-8 animate-in fade-in zoom-in duration-500 delay-200">
           {/* ส่งข้อมูลที่ปรับเป็นมาตรฐานแล้วเข้าไป */}
           <DashboardCharts tasks={plainTasks} />
        </div>
      </div>
    </div>
  );
}