"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// กำหนดโครงสร้างข้อมูลของตัวเลือก
export interface FilterOption {
  id: string;
  label: string;
}

interface TaskFiltersProps {
  current: string;           // ค่าที่เลือกอยู่ปัจจุบัน
  options: FilterOption[];   // รายการตัวเลือก
  onChange: (id: string) => void; 
  groupId: string;           // ชื่อกลุ่ม (สำคัญสำหรับ Animation ไม่ให้ตีกัน)
}

export default function TaskFilters({ current, options, onChange, groupId }: TaskFiltersProps) {
  return (
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
      {options.map((option) => {
        const isActive = current === option.id;
        
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              "relative px-3 py-1.5 text-xs font-bold rounded-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
              isActive
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            )}
            role="tab"
            aria-selected={isActive}
          >
            {/* พื้นหลังวิ่งได้ (Motion Background) */}
            {isActive && (
              <motion.div
                layoutId={`active-${groupId}`} // แยก ID ตามกลุ่ม
                className="absolute inset-0 bg-white dark:bg-slate-700 rounded-md shadow-sm border border-slate-200/50 dark:border-slate-600/50"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            
            <span className="relative z-10 whitespace-nowrap">
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}