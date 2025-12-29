"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ListTodo, 
  Settings, 
  Sparkles,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils"; 

export default function Sidebar() {
  const pathname = usePathname();

  // ฟังก์ชันเช็คสถานะ Active
  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col h-screen sticky top-0">
      
      {/* 1. Logo Section */}
      <div className="h-20 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
        <Link href="/dashboard" className="group flex items-center gap-2.5">
          <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-indigo-200 dark:shadow-none font-black text-white">
            <Sparkles size={20} />
          </div>
          <span className="text-2xl font-black bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tighter">
            Todolish
          </span>
        </Link>
      </div>
      
      {/* 2. Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 font-bold">
        
        <Link 
          href="/dashboard" 
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
            isActive("/dashboard") 
              ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400" 
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          )}
        >
          <LayoutDashboard size={20} /> Dashboard
        </Link>

        <Link 
          href="/task" 
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
            isActive("/task") 
              ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400" 
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          )}
        >
          <ListTodo size={20} /> My Tasks
        </Link>

        <Link 
          href="#" 
          className="flex items-center gap-3 px-4 py-3 text-slate-400 dark:text-slate-600 cursor-not-allowed rounded-xl transition-all font-medium"
        >
          <Calendar size={20} /> Calendar <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">Soon</span>
        </Link>

        <div className="h-px bg-slate-100 dark:bg-slate-800 my-4 mx-2" />

        {/* ✅ เปลี่ยนจาก /Settings เป็น /settings ให้ตรงกับชื่อโฟลเดอร์ */}
        <Link 
          href="/settings" 
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
            isActive("/settings") 
              ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400" 
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          )}
        >
          <Settings size={20} /> Settings
        </Link>
      </nav>

    </aside>
  );
}