import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, id, ...props }, ref) => {
    // 1. เรียก Hook ไว้ที่ส่วนบนสุดของ Component เสมอ (ห้ามมี if มาคั่น)
    const generatedId = React.useId();

    // 2. ตัดสินใจเลือกใช้ ID (ถ้า user ส่ง id มาให้ใช้ id นั้น ถ้าไม่ส่งมาให้ใช้ generatedId)
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {/* แสดง Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-0.5"
          >
            {label}
          </label>
        )}

        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            "flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition-all",
            "placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "dark:bg-slate-950 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600",
            // สไตล์เมื่อมี error
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500",
            className
          )}
          {...props}
        />

        {/* แสดงข้อความ Error */}
        {error && (
          <p className="text-xs font-medium text-red-500 ml-0.5">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;