import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "todo" | "in-progress" | "done";
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles = {
    todo: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    "in-progress": "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50",
    done: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50",
  };

  const labels = {
    todo: "To Do",
    "in-progress": "In Progress",
    done: "Completed",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize tracking-wide",
        styles[status],
        className
      )}
    >
      {labels[status]}
    </span>
  );
}