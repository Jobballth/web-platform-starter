"use client";

import { useState, useTransition } from "react";
import { Layers, Check, Trash2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
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
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filterStatus, setFilterStatus] =
    useState<FilterStatus>("all");

  const filteredTasks = tasks.filter((task) => {
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
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl">
            <Layers size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black">Recent Tasks</h2>
            <p className="text-xs text-slate-500">
              Manage and track your daily flow
            </p>
          </div>
        </div>

        <div className="flex p-1 bg-slate-100 rounded-xl">
          {(["all", "processing", "done"] as FilterStatus[]).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setFilterStatus(tab)}
                className={cn(
                  "px-4 py-1 text-xs font-bold rounded-lg",
                  filterStatus === tab
                    ? "bg-white shadow"
                    : "text-slate-500"
                )}
              >
                {tab === "done" ? "Completed" : tab}
              </button>
            )
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 p-4 bg-slate-50">
        {filteredTasks.length > 0 ? (
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onStatusChange={(id, status) =>
                  setTasks((prev) =>
                    prev.map((t) =>
                      t.id === id ? { ...t, status } : t
                    )
                  )
                }
                onDelete={(id) =>
                  setTasks((prev) =>
                    prev.filter((t) => t.id !== id)
                  )
                }
              />
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

function TaskItem({
  task,
  onStatusChange,
  onDelete,
}: {
  task: Task;
  onStatusChange: (id: string, status: Task["status"]) => void;
  onDelete: (id: string) => void;
}) {
  const [isPending, startTransition] = useTransition();

  const isCompleted =
    task.status === "DONE" || task.status === "COMPLETED";

  const handleToggle = () => {
    const prev = task.status;
    const next = isCompleted ? "TODO" : "DONE";

    onStatusChange(task.id, next);

    startTransition(async () => {
      try {
        await toggleTaskStatus(task.id, next);
      } catch {
        onStatusChange(task.id, prev);
        toast.error("Failed to update task");
      }
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={cn(
        "flex items-center gap-4 p-4 mb-3 rounded-xl border",
        isCompleted && "opacity-60"
      )}
    >
      <button onClick={handleToggle} className="h-6 w-6">
        <div
          className={cn(
            "h-full w-full rounded-full border-2",
            isCompleted && "bg-emerald-500 border-emerald-500"
          )}
        />
        {isCompleted && (
          <Check size={14} className="text-white -mt-5 ml-1" />
        )}
      </button>

      <h3
        className={cn(
          "flex-1 font-semibold",
          isCompleted && "line-through text-slate-400"
        )}
      >
        {task.title}
      </h3>

      <button
        onClick={async () => {
          if (confirm("Delete this task?")) {
            await deleteTask(task.id);
            onDelete(task.id);
          }
        }}
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
      <h3 className="font-bold">All Clear!</h3>
      <p className="text-xs text-slate-500">
        No tasks match your filter
      </p>
    </div>
  );
}
