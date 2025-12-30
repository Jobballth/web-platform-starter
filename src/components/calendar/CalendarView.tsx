"use client";

import { useState } from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths, 
  isToday 
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Interface ให้ตรงกับ Prisma Model ของคุณ
interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate?: Date | string | null;
}

interface CalendarViewProps {
  tasks: Task[];
}

export default function CalendarView({ tasks }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // คำนวณวันที่จะแสดงในหน้าปฏิทิน (รวมวันของเดือนก่อนหน้าและเดือนถัดไปเพื่อให้ตารางเต็ม)
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  // จัดสีตาม Priority
  const getPriorityColor = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case "HIGH": return "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800";
      case "MEDIUM": return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800";
      case "LOW": return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800";
      default: return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0B1120] rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
      
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button onClick={prevMonth} className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors text-slate-500">
              <ChevronLeft size={18} />
            </button>
            <button onClick={goToToday} className="px-3 py-1 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors">
              Today
            </button>
            <button onClick={nextMonth} className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors text-slate-500">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* ปุ่มสร้าง Task แบบเร็ว (Optional) */}
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none">
          <Plus size={16} />
          <span>New Event</span>
        </button>
      </div>

      {/* --- DAYS HEADER --- */}
      <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-3 text-center text-xs font-bold uppercase tracking-widest text-slate-400">
            {day}
          </div>
        ))}
      </div>

      {/* --- CALENDAR GRID --- */}
      <div className="grid grid-cols-7 grid-rows-5 flex-1 min-h-[600px]">
        {days.map((day, dayIdx) => {
          // กรอง Task ที่ตรงกับวันนี้
          const dayTasks = tasks.filter((task) => {
             if(!task.dueDate) return false;
             return isSameDay(new Date(task.dueDate), day);
          });

          const isCurrentMonth = isSameMonth(day, currentMonth);

          return (
            <div
              key={day.toString()}
              className={cn(
                "group relative border-b border-r border-slate-100 dark:border-slate-800 p-2 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/30 flex flex-col gap-1 min-h-[120px]",
                !isCurrentMonth && "bg-slate-50/30 dark:bg-slate-900/30"
              )}
            >
              {/* วันที่ */}
              <div className="flex justify-between items-start mb-1">
                <span
                  className={cn(
                    "text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full transition-colors",
                    !isCurrentMonth && "text-slate-300 dark:text-slate-600",
                    isCurrentMonth && "text-slate-700 dark:text-slate-300",
                    isToday(day) && "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none"
                  )}
                >
                  {format(day, "d")}
                </span>
              </div>

              {/* รายการ Task ในวันนั้น */}
              <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
                {dayTasks.map((task) => (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={task.id}
                    className={cn(
                      "px-2 py-1.5 rounded-lg border text-[10px] font-bold truncate cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1.5",
                      getPriorityColor(task.priority),
                      (task.status?.toUpperCase() === 'DONE' || task.status?.toUpperCase() === 'COMPLETED') && "opacity-50 grayscale line-through decoration-slate-400"
                    )}
                  > 
                    <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", 
                        task.priority?.toUpperCase() === 'HIGH' ? 'bg-rose-500' : 
                        task.priority?.toUpperCase() === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'
                    )} />
                    {task.title}
                  </motion.div>
                ))}
              </div>
              
            </div>
          );
        })}
      </div>
    </div>
  );
}