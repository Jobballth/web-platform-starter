"use client";

import UserAccountNav from "./UserAccountNav";

export default function Header() {
  return (
    <header className="h-16 border-b border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 flex items-center justify-between px-8">
      <div className="text-sm text-slate-500 font-medium">
        Search for tasks...
      </div>
      <UserAccountNav />
    </header>
  );
}