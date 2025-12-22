import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ฟังก์ชันช่วยรวม ClassName ตัดตัวซ้ำและจัดการเงื่อนไข
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}