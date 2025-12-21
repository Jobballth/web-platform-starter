import * as React from "react";
import { cn } from "@/lib/utils";

// กำหนด Props ของปุ่ม รองรับ variants (รูปแบบ) และ size
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // สไตล์พื้นฐาน (Base Styles)
          "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2",
          
          // Variants (สีและรูปแบบ)
          variant === "primary" && "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none focus:ring-indigo-500",
          variant === "secondary" && "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm focus:ring-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700",
          variant === "outline" && "border-2 border-slate-200 bg-transparent hover:bg-slate-50 text-slate-600 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",
          variant === "ghost" && "bg-transparent hover:bg-slate-100 text-slate-600 dark:text-slate-400 dark:hover:bg-slate-800",
          variant === "danger" && "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 dark:bg-rose-900/20 dark:border-rose-900/50 dark:text-rose-400",

          // Sizes (ขนาด)
          size === "sm" && "h-9 px-3 text-xs",
          size === "md" && "h-11 px-5 text-sm",
          size === "lg" && "h-14 px-8 text-base",
          size === "icon" && "h-10 w-10 p-2", // สำหรับปุ่มที่มีแค่ไอคอน

          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export default Button;