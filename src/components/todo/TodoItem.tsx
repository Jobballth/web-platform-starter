"use client";

import { Check, MoreHorizontal, Calendar } from "lucide-react";
import { Task } from "@/lib/data-mock";
import StatusBadge from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  task: Task;
}

export default function TodoItem({ task }: TodoItemProps) {
  const isCompleted = task.status === "completed";

  return (
    <div className="group flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer">
      <div className="flex items-center gap-4">
        {/* Checkbox Custom */}
        <div className={cn(
          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
          isCompleted 
            ? "bg-indigo-500 border-indigo-500" 
            : "border-slate-300 dark:border-slate-600 group-hover:border-indigo-400"
        )}>
          {isCompleted && <Check size={14} className="text-white" />}
        </div>

        {/* Task Details */}
        <div>
          <h4 className={cn(
            "font-medium text-slate-900 dark:text-white transition-all",
            isCompleted && "text-slate-400 line-through"
          )}>
            {task.title}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center text-xs text-slate-500">
              <Calendar size={12} className="mr-1" /> {task.date}
            </div>
            <StatusBadge status={task.priority} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
        <MoreHorizontal size={20} />
      </button>
    </div>
  );
}