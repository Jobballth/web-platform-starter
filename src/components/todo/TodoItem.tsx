"use client";

import { useState } from "react";
import { Calendar, Trash2 } from "lucide-react";
import { Task } from "@/lib/data-mock";
import StatusBadge from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TodoItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const AnimatedCheckmark = ({ isChecked }: { isChecked: boolean }) => {
  return (
    <motion.div
      initial={false}
      animate={isChecked ? "checked" : "unchecked"}
      className={cn(
        "relative flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors duration-300",
        isChecked
          ? "border-indigo-500 bg-indigo-500"
          : "border-slate-300 bg-transparent group-hover:border-indigo-400 dark:border-slate-600"
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="3.5"
        stroke="currentColor"
        className="h-3.5 w-3.5 text-white"
      >
        <motion.path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 12.75l6 6 9-13.5"
          variants={{
            unchecked: { pathLength: 0, opacity: 0 },
            checked: { pathLength: 1, opacity: 1 },
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        />
      </svg>
    </motion.div>
  );
};

export default function TodoItem({ task, onToggle, onDelete }: TodoItemProps) {
  // ✅ FIX: local state ใช้เฉพาะตอนคลิก
  const [isCompleted, setIsCompleted] = useState(
    task.status === "completed"
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.005 }}
      className={cn(
        "group relative flex items-center justify-between gap-4 rounded-xl border p-4 transition-all duration-300 shadow-sm",
        "bg-white/50 backdrop-blur-sm dark:bg-slate-900/50",
        isCompleted
          ? "border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30"
          : "border-slate-200 hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:hover:border-indigo-900/50"
      )}
    >
      <div
        onClick={() => {
          // ✅ optimistic update (ทันที)
          setIsCompleted((prev) => !prev);
          onToggle(task.id);
        }}
        className="flex flex-1 cursor-pointer items-start gap-4"
      >
        <div className="pt-0.5">
          <AnimatedCheckmark isChecked={isCompleted} />
        </div>

        <div className="flex flex-col gap-1.5">
          <h4
            className={cn(
              "text-base font-semibold text-slate-700 dark:text-slate-200",
              isCompleted &&
                "text-slate-400 line-through decoration-slate-400/50 dark:text-slate-600"
            )}
          >
            {task.title}
          </h4>

          <div className="flex items-center gap-2">
            <StatusBadge status={task.priority} />
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <div className="flex items-center text-xs font-medium text-slate-500">
              <Calendar size={12} className="mr-1.5" />
              {task.date}
            </div>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.1, color: "#f43f5e" }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/20"
      >
        <Trash2 size={18} />
      </motion.button>
    </motion.div>
  );
}
