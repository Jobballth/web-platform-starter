"use client";

import { Check, Trash2, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import Button from "@/components/ui/Button";

interface TodoItemProps {
  id: string;
  title: string;
  dueDate?: string;
  status: "todo" | "in-progress" | "done";
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function TodoItem({ id, title, dueDate, status, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="group flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="flex items-center gap-4">
        {/* Checkbox แบบ Custom */}
        <button
          onClick={() => onToggle?.(id)}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-lg border-2 transition-all",
            status === "done"
              ? "bg-indigo-600 border-indigo-600 text-white"
              : "border-slate-300 bg-white hover:border-indigo-400 dark:bg-slate-800 dark:border-slate-600"
          )}
        >
          {status === "done" && <Check size={14} strokeWidth={3} />}
        </button>

        {/* เนื้อหางาน */}
        <div className="flex flex-col">
          <span className={cn(
            "font-medium text-sm transition-all",
            status === "done" ? "text-slate-400 line-through decoration-slate-300" : "text-slate-700 dark:text-slate-200"
          )}>
            {title}
          </span>
          {dueDate && (
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
              <CalendarClock size={12} />
              {dueDate}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <StatusBadge status={status} />
        
        {/* ปุ่มลบจะโผล่มาเมื่อเอาเมาส์ชี้ (group-hover) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete?.(id)}
          className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all"
        >
          <Trash2 size={18} />
        </Button>
      </div>
    </div>
  );
}