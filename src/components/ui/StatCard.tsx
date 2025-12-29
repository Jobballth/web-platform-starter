import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon; // รับ Component Icon เข้ามาตรงๆ
  gradient: string; // รองรับสี Gradient เช่น "from-blue-500 to-indigo-600"
  description?: string;
  className?: string;
}

// ✅ เปลี่ยนจาก export default เป็น export function (Named Export)
export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  gradient, 
  description, 
  className 
}: StatCardProps) {
  return (
    <div className={cn(
      "group relative overflow-hidden bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
      className
    )}>
      <div className="relative z-10 flex justify-between items-start">
        <div className="flex flex-col">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
            {title}
          </p>
          <h3 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">
            {value}
          </h3>
        </div>

        {/* ตกแต่ง Icon ด้วย Gradient ตามที่ส่งมาจาก Props */}
        <div className={cn(
          "p-4 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300 bg-linear-to-br",
          gradient
        )}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>

      {description && (
        <p className="text-xs text-slate-400 mt-4 font-medium relative z-10">
          {description}
        </p>
      )}

      {/* ลูกเล่น Background Blur วงกลมจางๆ ด้านหลัง */}
      <div className={cn(
        "absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-linear-to-br",
        gradient
      )} />
    </div>
  );
}