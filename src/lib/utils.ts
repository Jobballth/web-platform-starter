import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ฟังก์ชันหัวใจหลักที่จะใช้ผสม class Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}