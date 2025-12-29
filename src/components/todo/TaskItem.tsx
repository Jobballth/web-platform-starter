"use client";

import { useState, useTransition } from "react";
import { Layers, CalendarDays, Check, Trash2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isToday } from "date-fns";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  toggleTaskStatus,
  deleteTask,
} from "@/app/(main)/(todolist)/dashboard/actions";

/* =======================
   Types
======================= */

export type FilterStatus = "all" | "processing" | "done";

export interface Task {
  id: string;
  title: string;
  status: "TODO" | "DONE" | "COMPLETED";
  priority: "HIGH" | "MEDIUM" | "LOW";
  dueDate?: Date | string | null;
  createdAt: Date | string;
}

/* =======================
   Main Container
======================= */

export function RecentTasksContainer({
  initialTasks,
}: {
  initialTasks: Task[];
}) {
  const [filterStatus, setFilterStatus] =
    useState<FilterStatus>("all");

  const filteredTasks = initialTasks.filter((task) => {
    if (filterStatus === "all") return true;

    if (filterStatus === "processing") {
      return task.status !== "DONE" && task.status !== "COMPLETED";
    }

    if (filterStatus === "done") {
      return task.status === "DONE" || task.status === "COMPLETED";
    }

    return true;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
            <Layers size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Recent Tasks
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Manage and track your daily flow
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {(["all", "processing", "done"] as FilterStatus[]).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setFilterStatus(tab)}
                className={cn(
                  "px-5 py-1.5 text-xs font-bold rounded-lg transition-all capitalize",
                  filterStatus === tab
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                )}
              >
                {tab === "done" ? "Completed" : tab}
              </button>
            )
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/30 dark:bg-slate-950/30">
        {filteredTasks.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </AnimatePresence>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

/* =======================
   Task Item
======================= */

function TaskItem({ task }: { task: Task }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(task.status);

  const isCompleted =
    status === "DONE" || status === "COMPLETED";

  const handleToggle = () => {
    const prev = status;
    const next = isCompleted ? "TODO" : "DONE";

    setStatus(next);

    startTransition(async () => {
      try {
        await toggleTaskStatus(task.id, prev);
        toast.success(
          isCompleted
            ? "Task marked as active"
            : "Task completed!"
        );
      } catch {
        setStatus(prev);
        toast.error("Failed to update task");
      }
    });
  };

  const getDateDisplay = () => {
    if (!task.dueDate) {
      return { text: "No date", isTodayStatus: false };
    }

    const dateObj = new Date(task.dueDate);
    const today = isToday(dateObj);

    return {
      text: today ? "Today" : format(dateObj, "MMM d, yyyy"),
      isTodayStatus: today,
    };
  };

  const { text: dateText, isTodayStatus } = getDateDisplay();

  const priorityConfig: Record<
    Task["priority"],
    string
  > = {
    HIGH: "text-rose-600 bg-rose-50 border-rose-100",
    MEDIUM: "text-amber-600 bg-amber-50 border-amber-100",
    LOW: "text-emerald-600 bg-emerald-50 border-emerald-100",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={handleToggle}
      className={cn(
        "group relative flex items-center gap-4 p-5 mb-3 rounded-2xl border cursor-pointer",
        isPending && "opacity-50 pointer-events-none",
        isCompleted
          ? "bg-slate-50 border-slate-100 opacity-60 dark:bg-slate-900/50"
          : "bg-white border-slate-200 hover:border-indigo-300 dark:bg-slate-900"
      )}
    >
      {/* Checkbox */}
      <div className="relative h-6 w-6">
        <div
          className={cn(
            "absolute inset-0 rounded-full border-2 transition",
            isCompleted
              ? "bg-emerald-500 border-emerald-500"
              : "border-slate-300"
          )}
        />
        {isCompleted && (
          <Check
            size={14}
            className="text-white absolute inset-1"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3
          className={cn(
            "font-semibold truncate",
            isCompleted &&
              "line-through text-slate-400"
          )}
        >
          {task.title}
        </h3>

        <div className="flex items-center gap-3 mt-1 text-xs">
          <div
            className={cn(
              isTodayStatus
                ? "text-indigo-600 font-bold"
                : "text-slate-400"
            )}
          >
            <CalendarDays
              size={12}
              className="inline mr-1"
            />
            {dateText}
          </div>

          <span
            className={cn(
              "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border",
              priorityConfig[task.priority]
            )}
          >
            {task.priority}
          </span>
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={async (e) => {
          e.stopPropagation();
          if (confirm("Delete this task?")) {
            await deleteTask(task.id);
            toast.success("Task deleted");
          }
        }}
        className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-500"
      >
        <Trash2 size={18} />
      </button>
    </motion.div>
  );
}

/* =======================
   Empty State
======================= */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <Clock size={32} className="text-slate-300 mb-4" />
      <h3 className="font-bold text-slate-700 dark:text-white">
        All Clear!
      </h3>
      <p className="text-xs text-slate-500 mt-1">
        No tasks match your filter
      </p>
    </div>
  );
}
