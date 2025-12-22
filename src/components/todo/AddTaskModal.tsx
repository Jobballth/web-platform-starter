"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { cn } from "@/lib/utils"; // อย่าลืม import cn

// 1. แก้ Interface ให้รับ priority เพิ่ม
interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { title: string; dueDate: string; priority: string }) => void;
}

export default function AddTaskModal({ isOpen, onClose, onAdd }: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  // 2. เพิ่ม State สำหรับเก็บค่า Priority (default เป็น medium)
  const [priority, setPriority] = useState("medium");

  const handleClose = () => {
    setTitle("");
    setDueDate("");
    setPriority("medium"); // รีเซ็ตค่าเมื่อปิด
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // 3. ส่งค่า priority ออกไปพร้อมกับข้อมูลอื่น
    onAdd({ title, dueDate, priority });
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 p-4"
      onClick={handleClose}
    >
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-100 dark:border-slate-800 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={handleClose}
          type="button"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Add New Task</h2>
        <p className="text-slate-500 text-sm mb-6">สร้างรายการใหม่เพื่อจัดการงานของคุณ</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Task Name"
            placeholder="เช่น ออกแบบหน้าเว็บ..." 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />

          <Input 
            label="Due Date"
            type="date" 
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          {/* 4. เพิ่มส่วนเลือก Priority ตรงนี้ */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['low', 'medium', 'high'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={cn(
                    "py-2 rounded-xl border text-sm capitalize transition-all font-medium",
                    priority === p 
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none" 
                      : "border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}