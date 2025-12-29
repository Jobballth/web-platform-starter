"use client";

import { Check, Trash2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleTaskStatus, deleteTask } from "@/app/(main)/(todolist)/dashboard/actions";
import { Task } from "@/components/dashboard/RecentTasksContainer";
import { toast } from "sonner";
import { motion } from "framer-motion"; // ✅ ลบ AnimatePresence ออกจากตรงนี้

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const isCompleted = task.status === 'completed';

  const handleToggle = async (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button.delete-btn')) return;
    try {
      await toggleTaskStatus(task.id, task.status);
    } catch {
      toast.error("Failed to update task");
    }
  };

  const priorityConfig = {
    high: { color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
    medium: { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    low: { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
  };

  const pStyle = priorityConfig[task.priority as keyof typeof priorityConfig] || priorityConfig.low;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }} // ✅ จะทำงานเมื่อตัวแม่ครอบ AnimatePresence
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={handleToggle}
      className={cn(
        "group relative flex items-center gap-4 p-5 mb-4 rounded-4xl border transition-colors duration-300",
        "cursor-pointer bg-white dark:bg-slate-900",
        isCompleted 
          ? "border-slate-100 dark:border-slate-800 bg-slate-50/50 opacity-60" 
          : "border-slate-100 dark:border-slate-800 shadow-sm hover:border-indigo-200"
      )}
    >
      {/* 1. Checkbox */}
      <div className="relative flex items-center justify-center h-7 w-7 shrink-0">
        <motion.div
          animate={{
            backgroundColor: isCompleted ? "#10b981" : "transparent",
            borderColor: isCompleted ? "#10b981" : "#e2e8f0",
          }}
          className={cn("absolute inset-0 rounded-full border-2", !isCompleted && "dark:border-slate-700")}
        />
        <motion.div
          initial={false}
          animate={{ scale: isCompleted ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <Check size={14} strokeWidth={4} className="text-white relative z-10" />
        </motion.div>
      </div>

      {/* 2. Content */}
      <div className="flex-1 min-w-0">
        <h3 className={cn(
          "font-bold text-lg tracking-tight truncate transition-all duration-300",
          isCompleted ? "text-slate-400 line-through" : "text-slate-800 dark:text-slate-100"
        )}>
          {task.title}
        </h3>
        
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className={isCompleted ? "text-slate-300" : "text-indigo-400"} />
            <span>
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}
            </span>
          </div>
          <span className="opacity-20">|</span>
          <span className={cn("px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-colors", 
            isCompleted ? "bg-slate-100 text-slate-400 border-slate-200" : cn(pStyle.bg, pStyle.color, pStyle.border))}>
            {task.priority}
          </span>
        </div>
      </div>

      {/* 3. Delete Button */}
      <motion.button 
        whileHover={{ scale: 1.1, backgroundColor: "#fee2e2" }}
        whileTap={{ scale: 0.9 }}
        className="delete-btn opacity-0 group-hover:opacity-100 p-2.5 text-slate-300 hover:text-rose-500 rounded-2xl transition-all"
        onClick={async (e) => {
          e.stopPropagation();
          await deleteTask(task.id);
          toast.success("Task deleted");
        }}
      >
        <Trash2 size={20} />
      </motion.button>
    </motion.div>
  );
}