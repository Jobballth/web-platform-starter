"use client";

import Link from "next/link";
import { 
  LayoutDashboard, 
  ListTodo, 
  Calendar, 
  Settings, 
  LogOut,
  Sparkles // เพิ่มไอคอนสำหรับลูกเล่น Logo
} from "lucide-react";
import { logout } from "@/app/dashboard/actions"; 

export default function Sidebar() {
  
  const handleLogout = async () => {
    await logout(); 
  };

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col h-screen sticky top-0">
      
      {/* ✅ 1. ส่วน Logo: ปรับ h-20 ให้เท่ากับ Header และเพิ่มเส้น border-b ให้ตีเส้นตรงกัน */}
      <div className="h-20 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
        <Link href="/dashboard" className="group flex items-center gap-2.5">
          {/* ไอคอน Logo ที่มีพื้นหลังและลูกเล่นหมุนตอน Hover */}
          <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-indigo-200 dark:shadow-none">
            <Sparkles className="text-white" size={20} />
          </div>
          
          {/* ข้อความ Todolish แบบไล่สี Gradient และ tracking-tighter */}
          <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tighter">
            Todolish
          </span>
        </Link>
      </div>
      
      {/* 2. ส่วนเมนูนำทาง (Nav Links) */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold transition-all">
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link href="/dashboard/tasks" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all font-medium">
          <ListTodo size={20} /> My Tasks
        </Link>
        <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all font-medium">
          <Calendar size={20} /> Calendar
        </Link>
        <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all font-medium">
          <Settings size={20} /> Settings
        </Link>
      </nav>

      {/* 3. ส่วนปุ่ม Sign Out */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 w-full px-4 py-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all font-bold group"
        >
          <div className="group-hover:-translate-x-1 transition-transform">
            <LogOut size={20} />
          </div>
          Sign Out
        </button>
      </div>
    </aside>
  );
}