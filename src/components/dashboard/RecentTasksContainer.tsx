"use client";

import { useState, useTransition } from "react";
import { Layers, CalendarDays, CheckCircle2, Clock, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isToday } from "date-fns";
import { toast } from "sonner";
import { toggleTaskStatus, deleteTask } from "@/app/(main)/(todolist)/dashboard/actions";
import { motion, AnimatePresence } from "framer-motion";

// --- Interfaces ---
export interface Task {
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

  // 1. กรองข้อมูลตาม Tab ที่เลือก
  const filteredTasks = initialTasks.filter((task) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "done") return task.status === "completed";
    if (filterStatus === "processing") return task.status === "processing" || task.status === "todo";
    return task.status === filterStatus;
  });

  // 2. จัดเรียง: งานที่ "completed" จะถูกส่งไปไว้ท้ายสุดเสมอ
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const aDone = a.status === 'completed' ? 1 : 0;
    const bDone = b.status === 'completed' ? 1 : 0;
    return aDone - bDone;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col min-h-[550px] animate-in fade-in duration-700">
      {/* --- Header --- */}
      <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 p-3 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
            <Layers size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Recent Tasks</h2>
            <p className="text-sm text-slate-500 font-medium">Your daily productivity flow</p>
          </div>
        </div>

        <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl self-start overflow-hidden">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={cn(
                "px-6 py-2 text-xs font-bold rounded-xl transition-all capitalize cursor-pointer",
                filterStatus === tab 
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200/50" 
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
              )}
            >
              {tab === 'done' ? 'Completed' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* --- Task List Area --- */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/20 dark:bg-slate-950/20 no-scrollbar">
        <AnimatePresence mode="popLayout" initial={false}>
          {sortedTasks.length > 0 ? (
            <motion.div layout className="space-y-4">
              {sortedTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </motion.div>
          ) : (
            <EmptyState key="empty-recent" />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TaskItem({ task }: { task: Task }) {
  const [isPending, startTransition] = useTransition();
  const isCompleted = task.status === "completed";

  const handleToggle = (e: React.MouseEvent) => {
    // ป้องกันการทำงานซ้อนถ้ากดปุ่มลบ
    if ((e.target as HTMLElement).closest('.action-btn')) return;

    startTransition(async () => {
      try {
        const result = await toggleTaskStatus(task.id, task.status);
        if (result.success) {
          toast.success(isCompleted ? "Reopened task" : "Task Completed! 🎉");
        }
      } catch {
        toast.error("Failed to update status");
      }
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure?")) return;

    startTransition(async () => {
      try {
        const result = await deleteTask(task.id);
        if (result.success) toast.success("Task deleted");
      } catch {
        toast.error("Could not delete task");
      }
    });
  };

  const { text: dateText, isToday: dateIsToday } = (() => {
    if (!task.dueDate) return { text: "No date", isToday: false };
    const dateObj = new Date(task.dueDate);
    const taskIsToday = isToday(dateObj);
    return { 
      text: taskIsToday ? "Today" : format(dateObj, "MMM d, yyyy"), 
      isToday: taskIsToday 
    };
  })();

  const priorityStyles = {
    high: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400",
    medium: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400",
    low: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400",
  };

  return (
    <motion.div
      layout
      // ✅ แอนิเมชันสลับตำแหน่งแบบนุ่มนวล (Tween) ลดอาการเด้งกระตุก
      transition={{
        layout: { type: "tween", ease: "easeOut", duration: 0.35 },
        opacity: { duration: 0.2 }
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -10 }}
      whileTap={{ scale: 0.985 }}
      onClick={handleToggle}
      className={cn(
        "group relative flex items-center justify-between p-5 rounded-4xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-colors cursor-pointer shadow-sm",
        isPending && "opacity-50 pointer-events-none grayscale",
        isCompleted && "opacity-60 grayscale-[0.8] bg-slate-50/50 border-transparent shadow-none"
    )}>
      <div className="flex items-center gap-5 flex-1 min-w-0">
         {/* Checkbox Icon */}
         <div className={cn(
           "h-7 w-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0",
           isCompleted ? "bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/20" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
         )}>
           <AnimatePresence mode="wait">
             {isCompleted && (
               <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.15 }}>
                 <CheckCircle2 size={16} className="text-white" strokeWidth={3} />
               </motion.div>
             )}
           </AnimatePresence>
         </div>

         <div className="min-w-0 flex-1">
            <h3 className={cn(
              "font-bold text-lg text-slate-800 dark:text-slate-100 truncate transition-all duration-300",
              isCompleted && "line-through text-slate-400 font-medium"
            )}>
              {task.title}
            </h3>
            <div className="flex items-center gap-3 text-xs font-bold mt-1">
              <span className={cn("flex items-center gap-1.5", dateIsToday && !isCompleted ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400")}>
                <CalendarDays size={14} />
                {dateText}
              </span>
              <span className="opacity-20 select-none">•</span>
              <span className={cn(
                "px-2.5 py-0.5 rounded-lg uppercase text-[10px] font-black tracking-widest border transition-all",
                isCompleted ? "bg-slate-100 text-slate-400 border-slate-200" : priorityStyles[task.priority as keyof typeof priorityStyles]
              )}>
                {task.priority}
              </span>
            </div>
         </div>
      </div>

      {/* Delete Button */}
      <button 
        onClick={handleDelete}
        className="action-btn opacity-0 group-hover:opacity-100 p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all cursor-pointer"
      >
        <Trash2 size={20} />
      </button>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="flex flex-col items-center justify-center h-80 text-center"
    >
      <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-full mb-4 shadow-inner">
        <Clock className="text-slate-300 dark:text-slate-600" size={40} />
      </div>
      <h3 className="text-lg font-black text-slate-900 dark:text-white">All Clear!</h3>
      <p className="text-slate-500 text-sm mt-1 max-w-[220px]">No tasks found for this filter.</p>
    </motion.div>
  );
}

export function RecentTasksSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 min-h-[550px] animate-pulse">
      <div className="p-8 border-b border-slate-100 h-28" />
      <div className="p-8 space-y-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-slate-50 dark:bg-slate-800/40 rounded-4xl" />
        ))}
      </div>
    </div>
  );
}