import { db } from "@/lib/db";
import { Layers, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface OverviewStatsProps {
  userId: string;
}

export async function OverviewStats({ userId }: OverviewStatsProps) {
  // ✅ แก้ไข: ปรับสถานะให้รองรับทั้งตัวพิมพ์ใหญ่ (ตาม DB/Actions) และตัวพิมพ์เล็กเพื่อความแม่นยำ
  const [total, pending, completed] = await Promise.all([
    db.task.count({ where: { userId } }),
    db.task.count({ 
      where: { 
        userId, 
        status: { in: ["TODO", "todo", "PROCESSING", "processing", "IN_PROGRESS"] } 
      } 
    }),
    db.task.count({ 
      where: { 
        userId, 
        status: { in: ["DONE", "done", "COMPLETED", "completed"] } 
      } 
    }),
  ]);

  const stats = [
    {
      label: "Total Tasks",
      value: total,
      icon: Layers,
      color: "text-indigo-600 dark:text-indigo-300",
      bg: "bg-indigo-50 dark:bg-indigo-500/10",
      border: "border-indigo-500",
      shadow: "shadow-indigo-100 dark:shadow-none",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-300",
      bg: "bg-amber-50 dark:bg-amber-500/10",
      border: "border-amber-500",
      shadow: "shadow-amber-100 dark:shadow-none",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-300",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      border: "border-emerald-500",
      shadow: "shadow-emerald-100 dark:shadow-none",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={cn(
            "group relative flex items-center justify-between p-6 rounded-2xl bg-white dark:bg-slate-900",
            "border border-slate-100 dark:border-slate-800",
            "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
            stat.shadow
          )}
        >
          {/* Left Accent Border (แถบสีด้านซ้าย) */}
          <div className={cn("absolute left-0 top-6 bottom-6 w-1.5 rounded-r-full", stat.bg, stat.border)} />

          {/* Left Side: Text Content */}
          <div className="pl-4 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {stat.label}
            </span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-slate-800 dark:text-white">
                {stat.value}
              </h3>
              <span className="text-[10px] font-medium text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-700">
                Tasks
              </span>
            </div>
          </div>

          {/* Right Side: Icon Box */}
          <div className={cn(
            "h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3",
            stat.bg // สีพื้นหลังกล่องไอคอน
          )}>
            <stat.icon size={26} className={stat.color} strokeWidth={2.5} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function OverviewStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-[108px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 animate-pulse flex items-center justify-between p-6">
          <div className="space-y-2 pl-4 w-full">
            <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800 rounded" />
            <div className="h-8 w-12 bg-slate-100 dark:bg-slate-800 rounded" />
          </div>
          <div className="h-14 w-14 bg-slate-100 dark:bg-slate-800 rounded-2xl shrink-0" />
        </div>
      ))}
    </div>
  );
}