'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Loader2, CalendarDays, Flag, Layers } from 'lucide-react';
import { createTask } from '@/app/(main)/(todolist)/dashboard/actions';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function CreateTaskModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [priority, setPriority] = useState('medium');

  // ✅ Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
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
        setPriority('medium');
        setIsOpen(false);
        toast.success('Task created successfully 🎉');
      } else {
        toast.error(result?.error || 'Failed to create task');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95 dark:shadow-none"
      >
        <Plus size={20} strokeWidth={2.5} />
        <span>New Task</span>
      </button>

      {isOpen && (
        // ✅ High z-index to overlay navbar
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="animate-in fade-in absolute inset-0 bg-slate-900/60 backdrop-blur-md duration-300"
            onClick={() => !isLoading && setIsOpen(false)}
          />

          <div className="animate-in zoom-in-95 slide-in-from-bottom-4 relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] duration-300 dark:border-slate-800 dark:bg-slate-900">
            {/* Header Section */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-8 py-6 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <Layers size={24} />
                </div>
                <div>
                  <h3 className="text-xl leading-none font-black tracking-tight text-slate-900 dark:text-white">
                    New Task
                  </h3>
                  <p className="mt-1.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                    Create your daily plan
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="cursor-pointer rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-0 dark:hover:bg-slate-800"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-7 p-8">
              {/* 1. Title Input */}
              <div className="space-y-2.5">
                <label className="ml-1 text-[11px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                  Task Title
                </label>
                <input
                  name="title"
                  required
                  autoFocus
                  placeholder="What needs to be done?"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base font-bold transition-all outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* 2. Due Date (Fixed) */}
              <div className="space-y-2.5">
                <label className="ml-1 text-[11px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                  Due Date
                </label>
                <div className="group relative">
                  <CalendarDays
                    className="pointer-events-none absolute top-1/2 left-5 z-10 -translate-y-1/2 text-slate-400 transition-colors group-hover:text-indigo-500"
                    size={22}
                  />

                  <input
                    type="date"
                    name="dueDate"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    onClick={(e) => e.currentTarget.showPicker()}
                    onKeyDown={(e) => {
                      if (e.key !== 'Tab') e.preventDefault();
                    }}
                    onMouseDown={(e) => e.preventDefault()} // ✅ ป้องกันคลิกเลือก / คลุม
                    onSelect={(e) => e.preventDefault()} // ✅ ป้องกัน selection
                    className="w-full cursor-pointer rounded-2xl border border-slate-200 bg-white py-4 pr-5 pl-14 text-base font-bold caret-transparent transition-all outline-none select-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white" // ✅ select-none สำคัญ
                  />
                </div>
              </div>

              {/* 3. Priority Level */}
              <div className="space-y-2.5">
                <label className="ml-1 text-[11px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                  Priority Level
                </label>
                <input type="hidden" name="priority" value={priority} />

                <div className="flex rounded-2xl border border-slate-200/50 bg-slate-100 p-1.5 dark:border-slate-700/50 dark:bg-slate-800/50">
                  {['low', 'medium', 'high'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={cn(
                        'flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl py-3 text-[12px] font-black capitalize transition-all',
                        priority === p
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50 dark:bg-slate-700 dark:text-white'
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                      )}
                    >
                      <Flag
                        size={14}
                        className={cn(
                          'transition-all',
                          priority === p && p === 'high'
                            ? 'fill-rose-500 text-rose-500'
                            : priority === p && p === 'medium'
                              ? 'fill-orange-500 text-orange-500'
                              : priority === p && p === 'low'
                                ? 'fill-emerald-500 text-emerald-500'
                                : 'text-slate-300 dark:text-slate-600'
                        )}
                      />
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
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-5 text-base font-black tracking-widest text-white uppercase shadow-xl shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 dark:shadow-none"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />
                      <span>Processing...</span>
                    </>
                  ) : (
                    'Create Task'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
