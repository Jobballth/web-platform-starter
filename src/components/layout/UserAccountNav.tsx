"use client";

import { User, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
// ✅ 1. นำเข้า signOut จาก next-auth/react
import { signOut } from "next-auth/react";
import Link from "next/link";

interface UserAccountNavProps {
  user: {
    fullName: string | null;
    email: string;
  } | null;
}

export default function UserAccountNav({ user }: UserAccountNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  // ✅ 2. ปรับปรุงฟังก์ชัน Logout ให้เสถียรขึ้น
  const handleLogout = async () => {
    try {
      // เรียกใช้ signOut ของ NextAuth
      // redirect: true จะทำให้หน้าเว็บเด้งไปที่ callbackUrl ทันที
      await signOut({ 
        redirect: true, 
        callbackUrl: "/auth/login" 
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="relative">
      {/* --- 1. Avatar Button --- */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "cursor-pointer h-10 w-10 rounded-full flex items-center justify-center transition-all active:scale-95 ring-2 shadow-sm",
          isOpen 
            ? "ring-indigo-500 bg-indigo-500 text-white" 
            : "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 ring-white dark:ring-slate-800 hover:ring-indigo-200"
        )}
      >
        {user?.fullName ? (
          <span className="font-bold text-sm">
            {user.fullName.charAt(0).toUpperCase()}
          </span>
        ) : (
          <User size={18} />
        )}
      </button>

      {/* --- 2. Dropdown Menu & Overlay --- */}
      {isOpen && (
        <>
          {/* Background Overlay สำหรับคลิกปิด */}
          <div 
            className="fixed inset-0 z-50 cursor-default" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
            
            {/* ข้อมูล User */}
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 mb-1">
              <p className="text-sm font-black text-slate-900 dark:text-white truncate">
                {user?.fullName || "User Account"}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-medium">
                {user?.email}
              </p>
            </div>

            {/* รายการเมนู */}
            <div className="px-2 space-y-1">
              <Link 
                href="/settings/profile"
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                  <User size={14} />
                </div>
                Profile
              </Link>
              
              <Link 
                href="/settings"
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                  <Settings size={14} />
                </div>
                Settings
              </Link>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2 mx-3" />

            {/* ปุ่ม Logout */}
            <div className="px-2">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors cursor-pointer"
              >
                <div className="p-1.5 bg-rose-100 dark:bg-rose-500/10 rounded-lg">
                  <LogOut size={14} />
                </div>
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}