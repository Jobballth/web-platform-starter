"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, Calendar, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "My Tasks", href: "/tasks", icon: CheckSquare },
  { label: "Calendar", href: "/calendar", icon: Calendar },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col gap-1.5 w-64 h-full bg-white border-r border-slate-200 dark:bg-slate-900 dark:border-slate-800">
      <div className="h-20 p-6  border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-black text-indigo-600 flex items-center gap-2 tracking-tighter italic">
          <CheckSquare className="size-8" /> TODOLISH
        </h1>
      </div>

      <nav className="flex-1 px-4 flex flex-col gap-4 mt-4 font-medium ">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                isActive 
                  ? "bg-indigo-50 text-indigo-600 shadow-sm" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon size={20} className={cn(isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-xl transition-colors font-semibold">
          <LogOut size={20} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
