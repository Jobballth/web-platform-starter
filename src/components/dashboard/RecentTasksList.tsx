"use client";

import { useState, useTransition } from "react";
import { Layers, CalendarDays, Check, Trash2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isToday } from "date-fns";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// ✅ นำเข้า Actions (ตรวจสอบ Path ให้ตรงกับโปรเจกต์ของคุณ)
import { toggleTaskStatus, deleteTask } from "@/app/(main)/(todolist)/dashboard/actions";

// --- 1. Interface ---
export interface Task {
  id: string;
  title: string;
  status: string;   // "TODO", "IN_PROGRESS", "DONE"
  priority: string; // "HIGH", "MEDIUM", "LOW"
  dueDate?: Date | string | null;
  createdAt: Date | string;
}

// --- 2. Main Container Component ---
export function RecentTasksContainer({ initialTasks }: { initialTasks: Task[] }) {
  const [filterStatus, setFilterStatus] = useState("all");
  const tabs = ['all', 'processing', 'done'];

  // ✅ Logic การกรองข้อมูลที่แม่นยำ
  const filteredTasks = initialTasks.filter((task) => {
    const status = task.status ? task.status.toUpperCase() : "TODO";

    if (filterStatus === "all") return true;
    
    // Processing: งานที่ยังไม่เสร็จ
    if (filterStatus === "processing") {
      return status !== "DONE" && status !== "COMPLETED";
    }

    // Done: งานที่เสร็จแล้ว
    if (filterStatus === "done") {
      return status === "DONE" || status === "COMPLETED";
    }

    return true;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
      {/* Header Section */}
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

        {/* Filter Tabs */}
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

      {/* Task List Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/30 dark:bg-slate-950/30">
        {filteredTasks.length > 0 ? (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

// --- 3. Item Component ---
function TaskItem({ task }: { task: Task }) {
  const [isPending, startTransition] = useTransition();
  
  // ✅ ตรวจสอบสถานะเสร็จสมบูรณ์
  const isCompleted = task.status?.toUpperCase() === 'DONE' || task.status?.toUpperCase() === 'COMPLETED';

  const handleToggle = async () => {
    startTransition(async () => {
      try {
        await toggleTaskStatus(task.id, task.status);
        toast.success(isCompleted ? "Task marked as active" : "Task completed!");
      } catch (error) {
        console.error(error);
        toast.error("Failed to update task");
      }
    });
  };

  // ✅ จัดการแสดงผลวันที่โดยใช้ฟังก์ชันที่นำเข้า
  const getDateDisplay = () => {
    if (!task.dueDate) return { text: "No date", isTodayStatus: false };
    try {
      const dateObj = new Date(task.dueDate);
      const isTaskToday = isToday(dateObj);
      return { 
        text: isTaskToday ? "Today" : format(dateObj, "MMM d, yyyy"), 
        isTodayStatus: isTaskToday 
      };
    } catch {
      return { text: "Invalid date", isTodayStatus: false };
    }
  };

  const { text: dateText, isTodayStatus } = getDateDisplay();

  const priorityConfig: Record<string, { color: string; bg: string; border: string }> = {
    HIGH: { color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
    MEDIUM: { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    LOW: { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
  };

  const pStyle = priorityConfig[task.priority?.toUpperCase()] || priorityConfig.LOW;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={handleToggle}
      className={cn(
        "group relative flex items-center gap-4 p-5 mb-3 rounded-2xl border transition-all duration-300",
        "cursor-pointer select-none",
        isPending && "opacity-50 pointer-events-none", // ✅ ใช้งาน isPending
        isCompleted 
          ? "bg-slate-50/50 border-slate-100 opacity-60 dark:bg-slate-900/50 dark:border-slate-800" 
          : "bg-white border-slate-200 shadow-sm hover:border-indigo-300 dark:bg-slate-900 dark:border-slate-800"
      )}
    >
      {/* Checkbox Visual */}
      <div className="relative flex items-center justify-center h-6 w-6 shrink-0">
        <motion.div
          animate={{
            backgroundColor: isCompleted ? "#10b981" : "transparent",
            borderColor: isPending ? "#6366f1" : (isCompleted ? "#10b981" : "#cbd5e1"),
          }}
          className={cn(
            "absolute inset-0 rounded-full border-2 transition-colors", 
            !isCompleted && "dark:border-slate-600",
            isPending && "animate-pulse" // ✅ ใช้งาน isPending
          )}
        />
        <motion.div
          initial={false}
          animate={{ scale: isCompleted ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <Check size={14} strokeWidth={4} className="text-white relative z-10" />
        </motion.div>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        <h3 className={cn(
          "font-semibold text-base tracking-tight truncate transition-all duration-300",
          // ✅ แก้ไข Class ขีดฆ่าให้ชัดเจน
          isCompleted 
            ? "text-slate-400 line-through decoration-slate-400/60 font-normal" 
            : "text-slate-800 dark:text-slate-200"
        )}>
          {task.title}
        </h3>
        
        <div className="flex items-center gap-3 mt-1.5">
          <div className={cn(
            "flex items-center gap-1.5 text-xs font-medium",
            isTodayStatus ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-slate-400"
          )}>
            <CalendarDays size={12} strokeWidth={isTodayStatus ? 2.5 : 2} /> {/* ✅ ใช้งาน CalendarDays */}
            <span>{dateText}</span>
          </div>

          <span className={cn(
            "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border", 
            isCompleted 
              ? "bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700" 
              : cn(pStyle.bg, pStyle.color, pStyle.border)
          )}>
            {task.priority}
          </span>
        </div>
      </div>

      {/* Delete Button */}
      <motion.button 
        disabled={isPending} // ✅ ใช้งาน isPending
        whileHover={{ scale: 1.1, backgroundColor: "#fee2e2", color: "#ef4444" }}
        whileTap={{ scale: 0.9 }}
        className="delete-btn opacity-0 group-hover:opacity-100 p-2 text-slate-300 rounded-xl transition-all"
        onClick={async (e) => {
          e.stopPropagation();
          if(confirm("Are you sure you want to delete this task?")) {
             await deleteTask(task.id);
             toast.success("Task deleted");
          }
        }}
      >
        <Trash2 size={18} />
      </motion.button>
    </motion.div>
  );
}

// --- 4. Empty State ---
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

// --- 5. Skeleton ---
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