import { CheckCircle2, Circle,LayoutList } from "lucide-react";

interface StatsProps {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}

export function StatsCards({ total, completed, pending,}: StatsProps) {
  const stats = [
    { label: "Total Tasks", value: total, icon: LayoutList, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Completed", value: completed, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Pending", value: pending, icon: Circle, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-slate-900 p-6 rounded-4xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
          <div className={`p-3 rounded-2xl mb-3 ${stat.bg} ${stat.color}`}>
            <stat.icon size={24} />
          </div>
          <h4 className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stat.value}</h4>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}