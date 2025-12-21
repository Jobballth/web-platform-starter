"use client";

import { User } from "lucide-react";

export default function UserAccountNav() {
  return (
    <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Demo User</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">admin@todolish.com</p>
      </div>
      
      {/* รูป Profile จำลอง (Avatar) */}
      <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 ring-2 ring-white dark:ring-slate-800 shadow-sm cursor-pointer hover:opacity-80 transition-opacity">
        <User size={20} />
      </div>
    </div>
  );
}