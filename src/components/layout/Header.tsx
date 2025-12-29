// @/components/dashboard/Header.tsx (หรือไฟล์ที่คุณส่งมา)
import Link from "next/link";
import UserAccountNav from "./UserAccountNav";
import ThemeToggle from "../ui/theme/ThemeToggle"; 
import { getAuthUser } from "@/app/(main)/(todolist)/dashboard/actions";

export default async function Header() { 
  const user = await getAuthUser(); 

  return (
    // ✅ เปลี่ยนจาก z-40 เป็น z-30 เพื่อให้ Modal (z-50+) ทับได้
    <header className="h-20 border-b min-h-20 border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 flex items-center justify-end px-8 sticky top-0 z-10">

      {/* 2. ส่วนขวา: กลุ่มปุ่มและสถานะผู้ใช้ */}
      <div className="flex items-center gap-4"> 
        <ThemeToggle />

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden md:block" />
        
        <div className="flex items-center">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end leading-none gap-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {user.fullName}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-tight">
                  {user.email}
                </span>
              </div>
              
              <UserAccountNav user={user} />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors">
                Sign In
              </Link>
              <Link href="/auth/register" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-lg transition-all active:scale-95">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}