import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  className?: string;
}

export default function StatCard({ title, value, icon: Icon, description, className }: StatCardProps) {
  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow",
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
        </div>
        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
          <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>
      {description && (
        <p className="text-xs text-slate-400 mt-2 font-medium">
          {description}
        </p>
      )}
    </div>
  );
}