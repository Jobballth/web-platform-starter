import { db } from "@/lib/db"; 
import { getAuthUser } from "./actions";
import { redirect } from "next/navigation";
import { StatsCards } from "@/components/dashboard/StatsCards";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import { addDays, endOfMonth, isBefore, startOfDay } from "date-fns";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/");
  }

  const tasks = await db.task.findMany({ where: { userId: user.id } });
  const today = startOfDay(new Date());

  // --- FILTERING ---
  const pendingTasks = tasks.filter(t => {
    const s = t.status ? t.status.toUpperCase() : "";
    return s !== "DONE" && s !== "COMPLETED";
  });

  const next7DaysTasks = pendingTasks.filter(t => {
    if (!t.dueDate) return false;
    const dueDate = new Date(t.dueDate);
    return isBefore(dueDate, addDays(today, 8)) && !isBefore(dueDate, today);
  });

  const thisMonthTasks = pendingTasks.filter(t => {
    if (!t.dueDate) return false;
    const dueDate = new Date(t.dueDate);
    return isBefore(dueDate, addDays(endOfMonth(today), 1)) && !isBefore(dueDate, today);
  });

  const plainTasks = tasks.map(task => {
    const s = task.status ? task.status.toUpperCase() : "TODO";
    const normalizedStatus = (s === "DONE" || s === "COMPLETED") ? "DONE" : s;
    return { id: task.id, priority: task.priority?.toUpperCase(), status: normalizedStatus };
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => {
      const s = t.status ? t.status.toUpperCase() : "";
      return s === "DONE" || s === "COMPLETED";
    }).length,
    pending: pendingTasks.length,
    highPriority: pendingTasks.filter(t => t.priority?.toUpperCase() === "HIGH").length
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] pb-20 relative overflow-hidden">

      {/* Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-size-[20px_20px] opacity-50 pointer-events-none" />

      {/* 🔹 แก้ไขจุดนี้: เปลี่ยนจาก max-w-7xl เป็น max-w-[1600px] เพื่อขยายความกว้าง */}
      <div className="max-w-[1600px] mx-auto px-6 py-8 relative z-10 space-y-8">

        {/* Stats Cards (Completed / Pending สลับตำแหน่ง) */}
        <div className="animate-in fade-in zoom-in duration-500">
          <StatsCards
            total={stats.total}
            overdue={stats.highPriority}
            pending={stats.completed}
            completed={stats.pending}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">

          {/* Charts */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-4xl border border-slate-100 dark:border-slate-800 shadow-md p-4 h-full">
              <DashboardCharts tasks={plainTasks} />
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* Next 7 Days */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-4xl border border-slate-100 dark:border-slate-800 shadow-md flex flex-col flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-2xl">
                    <CalendarDays size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 dark:text-white text-sm">Upcoming</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Next 7 Days</p>
                  </div>
                </div>
                <span className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-black px-2.5 py-1 rounded-lg min-w-[30px] text-center">
                  {next7DaysTasks.length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {next7DaysTasks.slice(0,3).map(t => (
                  <div key={t.id} className="group flex items-center justify-between text-sm p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-transparent hover:border-indigo-200 dark:hover:border-indigo-400 transition-all cursor-pointer">
                    <div className="flex items-center gap-3 truncate mr-3">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${t.priority === 'HIGH' ? 'bg-rose-500' : t.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{t.title}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-500 transition-colors whitespace-nowrap">
                      {t.dueDate ? new Date(t.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '-'}
                    </span>
                  </div>
                ))}
                {next7DaysTasks.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 opacity-60 min-h-20">
                    <p className="text-xs font-bold">No urgent tasks</p>
                  </div>
                )}
              </div>

              {/* 🔹 View All Tasks */}
              <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-end">
                <a href="/task" className="text-[10px] font-bold text-slate-400 hover:text-indigo-500 flex items-center gap-1 transition-colors">
                  View all tasks <ArrowRight size={12} />
                </a>
              </div>
            </div>

            {/* This Month */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-4xl border border-slate-100 dark:border-slate-800 shadow-md flex flex-col flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 rounded-2xl">
                    <Clock size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 dark:text-white text-sm">Monthly</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">This Month</p>
                  </div>
                </div>
                <span className="bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-black px-2.5 py-1 rounded-lg min-w-[30px] text-center">
                  {thisMonthTasks.length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {thisMonthTasks.slice(0,3).map(t => (
                  <div key={t.id} className="group flex items-center justify-between text-sm p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-transparent hover:border-rose-200 dark:hover:border-rose-400 transition-all cursor-pointer">
                    <div className="flex items-center gap-3 truncate mr-3">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${t.priority === 'HIGH' ? 'bg-rose-500' : t.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{t.title}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-rose-500 transition-colors whitespace-nowrap">
                      {t.dueDate ? new Date(t.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '-'}
                    </span>
                  </div>
                ))}
                {thisMonthTasks.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 opacity-60 min-h-20">
                    <p className="text-xs font-bold">All clear this month</p>
                  </div>
                )}
              </div>

              {/* View All */}
              <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-end">
                <a href="/task" className="text-[10px] font-bold text-slate-400 hover:text-indigo-500 flex items-center gap-1 transition-colors">
                  View all tasks <ArrowRight size={12} />
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}