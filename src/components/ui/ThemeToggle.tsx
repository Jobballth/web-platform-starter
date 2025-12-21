"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Button from "@/components/ui/Button"; // ใช้ Button เดิมที่คุณมี

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // ป้องกัน Error Hydration mismatch (รอให้โหลดฝั่ง Client เสร็จก่อน)
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // แสดงปุ่มเปล่าๆ ไปก่อนระหว่างรอโหลด เพื่อไม่ให้หน้ากระตุก
    return (
      <Button variant="secondary" className="w-10 h-10 px-0">
        <span className="sr-only">Loading theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="secondary"
      className="w-10 h-10 px-0 relative overflow-hidden"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title="Toggle Theme"
    >
      {/* ไอคอนพระอาทิตย์ (หมุนออกเมื่อเป็น Dark) */}
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-slate-900 dark:text-slate-100" />
      
      {/* ไอคอนพระจันทร์ (หมุนเข้าเมื่อเป็น Dark) */}
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-slate-900 dark:text-slate-100" />
      
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}