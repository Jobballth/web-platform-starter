// src/components/todo/TaskFilters.tsx
"use client";

import { cn } from "@/lib/utils";

interface TaskFiltersProps {
  current: string;
  onChange: (filter: string) => void;
}

export default function TaskFilters({ current, onChange }: TaskFiltersProps) {
  const filters = ["all", "todo", "in-progress", "completed"];

  return (
    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg ">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={cn(
            "cursor-pointer px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all",
            current === filter
              ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          )}
        >
          {filter.replace("-", " ")}
        </button>
      ))}
    </div>
  );
}