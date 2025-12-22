"use client";

import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { createTask } from "@/app/dashboard/actions";

export default function CreateTaskModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // ✅ 1. ล็อคค่า Form ไว้ในตัวแปรทันที (ป้องกัน Error reading reset)
    const form = e.currentTarget; 
    const formData = new FormData(form);

    setIsLoading(true);

    try {
      const result = await createTask(formData);

      if (result?.success) {
        // ✅ 2. สั่ง Reset ผ่านตัวแปรที่เราล็อคไว้
        form.reset(); 
        setIsOpen(false);
      } else {
        alert(result?.error || "เกิดข้อผิดพลาด");
      }
    } catch  {
      alert("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg flex items-center gap-2 active:scale-95 transition-all"
      >
        <Plus size={18} /> New Task
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)} 
          />
          
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl relative border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Create New Task</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20}/>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Task Title</label>
                <input 
                  name="title" 
                  required 
                  placeholder="เช่น ประชุมทีมตอนเช้า" 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Description (Optional)</label>
                <textarea 
                  name="description" 
                  placeholder="รายละเอียดงาน..." 
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 resize-none" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Priority</label>
                <select 
                  name="priority" 
                  defaultValue="medium" 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <button 
                disabled={isLoading} 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20}/> : "Create Task"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}