"use client";

import { User, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { createPortal } from "react-dom";

interface UserAccountNavProps {
  user: {
    fullName: string | null;
    email: string;
  } | null;
}

export default function UserAccountNav({ user }: UserAccountNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/auth/login",
    });
  };

  // ✅ FIX จริง: ป้องกัน SSR ใช้ document
  const canUseDOM = typeof document !== "undefined";

  return (
    <div className="relative">
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
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

      {/* Dropdown */}
      {isOpen &&
        canUseDOM &&
        createPortal(
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <div
              className="
                fixed right-6 top-16 w-64
                bg-white dark:bg-slate-900
                border border-slate-200 dark:border-slate-800
                rounded-3xl shadow-2xl py-2
                animate-in fade-in zoom-in-95 duration-200
                origin-top-right
                z-50
              "
            >
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <p className="text-sm font-black truncate">
                  {user?.fullName || "User Account"}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {user?.email}
                </p>
              </div>

              <div className="px-2 space-y-1">
                <Link
                  href="/settings/profile"
                  onClick={() => setIsOpen(false)}
                  className="menu-item"
                >
                  <User size={14} /> Profile
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setIsOpen(false)}
                  className="menu-item"
                >
                  <Settings size={14} /> Settings
                </Link>
              </div>

              <div className="my-2 h-px bg-slate-100 dark:bg-slate-800" />

              <button
                onClick={handleLogout}
                className="menu-item text-rose-500"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </>,
          document.body
        )}
    </div>
  );
}
