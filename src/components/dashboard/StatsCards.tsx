import { CheckCircle2, LayoutList } from 'lucide-react';

interface StatsProps {
  total: number;
  completed: number;
  pending: number;
  overdue?: number; // เพิ่ม optional ถ้ามี
}

export function StatsCards({ total, completed, pending, overdue }: StatsProps) {
  // 🔹 ลำดับ card: Total | Pending | Completed | Overdue (ถ้ามี)
  const stats = [
    {
      label: 'Total Tasks',
      value: total,
      icon: LayoutList,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Pending',
      value: pending,
      icon: CheckCircle2,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
    },
    {
      label: 'High Priority',
      value: overdue,
      icon: CheckCircle2,
      color: 'text-rose-600',
      bg: 'bg-rose-50 dark:bg-rose-900/20',
    },

    {
      label: 'Completed',
      value: completed,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-2 gap-6 md:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex flex-col items-center rounded-4xl border border-slate-100 bg-white p-6 text-center shadow-lg transition-transform duration-200 hover:scale-105 dark:border-slate-800 dark:bg-slate-900"
        >
          <div
            className={`mb-3 rounded-2xl p-3 ${stat.bg} ${stat.color} flex items-center justify-center`}
          >
            <stat.icon size={28} />
          </div>
          <h4 className="mb-1 text-3xl font-extrabold text-slate-900 dark:text-white">
            {stat.value}
          </h4>
          <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
