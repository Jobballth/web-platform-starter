"use client";

import UserAccountNav from "./UserAccountNav";
import ThemeToggle from "./../ui/ThemeToggle";


export default function Header() {
  return (
    <header className="h-20 border-b border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 flex items-center justify-between px-8">
      <div className="text-sm text-slate-500 font-medium">
        Search for tasks...
      </div>
      <div className="flex items-center gap-3">
      <ThemeToggle />
      <UserAccountNav />
      </div>
    </header>
  );
}