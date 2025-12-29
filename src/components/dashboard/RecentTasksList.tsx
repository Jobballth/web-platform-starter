"use client";

import { useState, useTransition } from "react";
import { Layers, CalendarDays, MoreHorizontal, CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isToday } from "date-fns";
import { toast } from "sonner";

// --- Interfaces ---
interface Task {
  id: string;
  title: string;
  status: string; 
  priority: string; 
  dueDate?: Date | string | null;
  createdAt: Date | string;
}

export function RecentTasksContainer({ initialTasks }: { initialTasks: Task[] }) {
  const [filterStatus, setFilterStatus] = useState("all");
  const tabs = ['all', 'processing', 'done'];

  // ✅ แก้ไข Logic การกรองข้อมูลตรงนี้
  const filteredTasks = initialTasks.filter((task) => {
    if (filterStatus === "all") return true;
    
    // ถ้าเลือก Tab 'Completed' (done)
    if (filterStatus === "done") return task.status === "completed";
    
    // ✅ ถ้าเลือก Tab 'Processing' ให้แสดงทั้งสถานะ 'todo' และ 'processing'
    // เพื่อให้งานที่เพิ่งสร้างใหม่ (ยังไม่เสร็จ) ปรากฏขึ้นมาในช่องนี้ด้วย
    if (filterStatus === "processing") {
      return task.status === "processing" || task.status === "todo";
    }
    
    return task.status === filterStatus;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3 text-left">
          <div className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
            <Layers size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white leading-none">Recent Tasks</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">Manage and track your daily flow</p>
          </div>
        </div>

        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start overflow-x-auto max-w-full no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={cn(
                "px-5 py-1.5 text-xs font-bold rounded-lg transition-all capitalize whitespace-nowrap cursor-pointer",
                filterStatus === tab 
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-600" 
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 hover:bg-slate-200/50"
              )}
            >
              {tab === 'done' ? 'Completed' : tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/30 dark:bg-slate-950/30">
        {filteredTasks.length > 0 ? (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

// ... ส่วนคอมโพเนนต์ TaskItem, EmptyState และ RecentTasksSkeleton เหมือนเดิม ...
function TaskItem({ task }: { task: Task }) {
  const [isPending, startTransition] = useTransition();
  const isCompleted = task.status === "completed";

  const handleToggleStatus = async () => {
    startTransition(async () => {
        try {
            toast.success(isCompleted ? "Task reopened" : "Task marked as completed");
        } catch (error) {
            console.error("Update failed:", error);
            toast.error("Failed to update task status");
        }
    });
  };

  const getDateDisplay = () => {
    if (!task.dueDate) return { text: "No date", isToday: false };
    try {
      const dateObj = new Date(task.dueDate);
      const isTaskToday = isToday(dateObj);
      return { text: isTaskToday ? "Today" : format(dateObj, "MMM d, yyyy"), isToday: isTaskToday };
    } catch {
      return { text: "Invalid date", isToday: false };
    }
  };

  const { text: dateText, isToday: dateIsToday } = getDateDisplay();

  const getPriorityStyle = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20";
      case 'medium': return "bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20";
      default: return "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
    }
  };

  return (
    <div className={cn(
        "group flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-all duration-200 animate-in fade-in slide-in-from-left-2 text-left",
        isPending && "opacity-50 pointer-events-none cursor-wait"
    )}>
      <div className="flex items-start gap-4 flex-1 min-w-0">
         <button onClick={handleToggleStatus} disabled={isPending} className="mt-0.5 shrink-0 cursor-pointer active:scale-90 transition-transform disabled:opacity-50 focus:outline-none">
           {isCompleted ? (
             <CheckCircle2 className="text-emerald-500 drop-shadow-sm" size={22} strokeWidth={2.5} />
           ) : (
             <Circle className="text-slate-300 dark:text-slate-600 hover:text-indigo-500 transition-colors" size={22} strokeWidth={1.5} />
           )}
         </button>
         <div className="min-w-0 flex-1">
            <h3 className={cn("font-bold text-slate-800 dark:text-slate-200 truncate text-[15px] tracking-tight transition-all", isCompleted && "line-through text-slate-400 dark:text-slate-500 font-normal")}>
              {task.title}
            </h3>
            <div className="flex items-center gap-3 text-[11px] font-medium mt-1">
              <span className={cn("flex items-center gap-1.5", dateIsToday ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-slate-500 dark:text-slate-400")}>
                <CalendarDays size={12} strokeWidth={dateIsToday ? 2.5 : 2} />
                {dateText}
              </span>
              <span className="text-slate-200 dark:text-slate-700 select-none">•</span>
              <span className={cn("px-2 py-0.5 rounded-md uppercase text-[9px] font-black tracking-wider border", getPriorityStyle(task.priority))}>
                {task.priority}
              </span>
            </div>
         </div>
      </div>
      <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-all rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none"><MoreHorizontal size={18} /></button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center animate-in fade-in zoom-in duration-300">
      <div className="bg-slate-100 dark:bg-slate-800/50 p-5 rounded-full mb-4 shadow-inner">
        <Clock className="text-slate-300 dark:text-slate-600" size={32} />
      </div>
      <h3 className="text-base font-black text-slate-900 dark:text-white">All Clear!</h3>
      <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 max-w-[200px] leading-relaxed">No tasks match your current filter.</p>
    </div>
  );
}

export function RecentTasksSkeleton() {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden min-h-[500px] animate-pulse">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 h-24 bg-slate-50/50 dark:bg-slate-800/50" />
            <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full" />
                ))}
            </div>
        </div>
    );
}