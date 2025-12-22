"use client";

import { User } from "lucide-react";

interface UserAccountNavProps {
  user: {
    fullName: string | null;
    email: string;
  } | null;
}

export default function UserAccountNav({ user }: UserAccountNavProps) {
  return (
    <div className="flex items-center">
      {/* ✅ ลบส่วน <div className="text-right">...</div> เดิมออกทั้งหมด */}
      
      {/* เหลือไว้แค่รูป Avatar วงกลมเท่านั้น */}
      <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 ring-2 ring-white dark:ring-slate-800 shadow-sm cursor-pointer hover:opacity-80 transition-opacity">
        {user?.fullName ? (
          <span className="font-bold text-base">
            {user.fullName.charAt(0).toUpperCase()}
          </span>
        ) : (
          <User size={20} />
        )}
      </div>
    </div>
  );
}