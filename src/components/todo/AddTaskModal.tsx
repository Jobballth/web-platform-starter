"use client";

import * as React from "react"; // ใช้ * as React เพื่อความปลอดภัยของ Type
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

// นิยาม Interface ให้ชัดเจน
export interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: { title: string; dueDate: string }) => void;
}

// ระบุ Type ให้กับ Component อย่างชัดเจน
const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");

  // ป้องกันการเรียก Hook ภายใต้เงื่อนไข (Conditional Hook) 
  // โดยการวาง logic เช็ค isOpen ไว้ในส่วนของ return แทน
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onAdd({ title, dueDate });
    setTitle("");
    setDueDate("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-100 dark:border-slate-800 relative">
        <button 
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100"
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

          <div className="pt-4 flex gap-3">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
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
};

export default AddTaskModal;