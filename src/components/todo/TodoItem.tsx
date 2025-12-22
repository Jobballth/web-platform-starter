"use client";

import { Check, Calendar, Trash2 } from "lucide-react";
import { Task } from "@/lib/data-mock";
import StatusBadge from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion"; // 1. เพิ่ม motion

interface TodoItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ task, onToggle, onDelete }: TodoItemProps) {
  const isCompleted = task.status === "completed";

  return (
    <motion.div
      // 2. เพิ่ม Hover และ Tap Effects ให้การ์ด
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "group flex items-center justify-between p-4 transition-all duration-200",
        "bg-white dark:bg-slate-900 border rounded-xl shadow-sm",
        isCompleted 
          ? "border-slate-100 dark:border-slate-800 opacity-70" 
          : "border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md"
      )}
    >
      <div className="flex items-center gap-4 flex-1">
        {/* Checkbox พร้อม Animation เครื่องหมายถูก */}
        <button 
          onClick={() => onToggle(task.id)}
          className={cn(
            "relative w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
            isCompleted 
              ? "bg-indigo-500 border-indigo-500" 
              : "border-slate-300 dark:border-slate-600 group-hover:border-indigo-400"
          )}
        >
          {isCompleted && (
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Check size={14} className="text-white font-bold" strokeWidth={3} />
            </motion.div>
          )}
        </button>

        {/* รายละเอียดงาน */}
        <div className="flex-1 cursor-pointer" onClick={() => onToggle(task.id)}>
          <h4 className={cn(
            "font-medium text-slate-900 dark:text-white transition-all duration-300",
            isCompleted && "text-slate-400 dark:text-slate-500 line-through decoration-indigo-500/30"
          )}>
            {task.title}
          </h4>
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex items-center text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              <Calendar size={12} className="mr-1.5 text-indigo-500" /> 
              {task.date}
            </div>
            <StatusBadge status={task.priority} />
          </div>
        </div>
      </div>

      {/* Actions: ปุ่มลบพร้อมลูกเล่นเอียงตัว */}
      <motion.button 
        whileHover={{ scale: 1.1, rotate: 8 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        className={cn(
          "p-2 text-slate-400 hover:text-rose-500 transition-all rounded-lg",
          "opacity-100 sm:opacity-0 sm:group-hover:opacity-100", // ซ่อนบนคอมแต่โชว์บนมือถือ
          "hover:bg-rose-50 dark:hover:bg-rose-950/30"
        )}
        title="Delete task"
      >
        <Trash2 size={18} />
      </motion.button>
    </motion.div>
  );
}