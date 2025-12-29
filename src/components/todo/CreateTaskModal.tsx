"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, X, Loader2, CalendarDays, Flag, Layers } from "lucide-react";
import { createTask } from "@/app/(main)/(todolist)/dashboard/actions";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function CreateTaskModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [priority, setPriority] = useState("medium");
  
  const dateInputRef = useRef<HTMLInputElement>(null);

  // ✅ ป้องกันการ Scroll หน้าจอหลักเมื่อเปิด Modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget; 
    const formData = new FormData(form);
    setIsLoading(true);

    try {
      const result = await createTask(formData);
      if (result?.success) {
        form.reset(); 
        setPriority("medium");
        setIsOpen(false);
        toast.success("Task created successfully 🎉");
      } else {
        toast.error(result?.error || "Failed to create task");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateClick = () => {
    if (dateInputRef.current) {
      try {
        dateInputRef.current.showPicker(); 
      } catch {
        dateInputRef.current.focus(); 
      }
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 dark:shadow-none flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
      >
        <Plus size={20} strokeWidth={2.5} /> 
        <span>New Task</span>
      </button>

      {isOpen && (
        // ✅ เปลี่ยน z-index เป็น [100] เพื่อทับ Navbar (z-30) แน่นอน
        <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
          
          {/* Backdrop - เพิ่ม blur และสีที่เข้มขึ้นเล็กน้อย */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={() => !isLoading && setIsOpen(false)} 
          />
          
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] relative border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden">
            
            {/* Header Section */}
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-500/10 rounded-2xl text-indigo-600 dark:text-indigo-400">
                   <Layers size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none tracking-tight">New Task</h3>
                  <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-widest">Create your daily plan</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                disabled={isLoading}
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer disabled:opacity-0"
              >
                <X size={22}/>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-7">
              
              {/* 1. Title Input */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">
                  Task Title
                </label>
                <input 
                  name="title" 
                  required 
                  autoFocus
                  placeholder="What needs to be done?" 
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-base font-bold placeholder:text-slate-400 dark:text-white" 
                />
              </div>

              {/* 2. Due Date */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">
                  Due Date
                </label>
                <div 
                  className="relative group cursor-pointer" 
                  onClick={handleDateClick} 
                >
                  <input 
                    type="date"
                    name="dueDate" 
                    ref={dateInputRef} 
                    required
                    className="w-full pl-14 pr-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-base font-bold cursor-pointer dark:text-white" 
                  />
                  <CalendarDays 
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors pointer-events-none" 
                    size={22} 
                  />
                </div>
              </div>

              {/* 3. Priority Level */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">
                  Priority Level
                </label>
                <input type="hidden" name="priority" value={priority} />
                
                <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                  {['low', 'medium', 'high'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={cn(
                        "flex-1 py-3 text-[12px] font-black rounded-xl capitalize transition-all flex items-center justify-center gap-2 cursor-pointer",
                        priority === p 
                          ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200/50" 
                          : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      )}
                    >
                      <Flag size={14} className={cn(
                        "transition-all",
                        priority === p && p === 'high' ? "fill-rose-500 text-rose-500" :
                        priority === p && p === 'medium' ? "fill-orange-500 text-orange-500" :
                        priority === p && p === 'low' ? "fill-emerald-500 text-emerald-500" :
                        "text-slate-300 dark:text-slate-600"
                      )} />
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button 
                  disabled={isLoading} 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer text-base uppercase tracking-widest"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={24}/>
                      <span>Processing...</span>
                    </>
                  ) : "Create Task"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}