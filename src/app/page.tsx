"use client";

import { useState } from "react";
import { ListTodo, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import TodoItem from "@/components/todo/TodoItem";
import TaskFilters from "@/components/todo/TaskFilters"; // นำ TaskFilters เข้ามา
import { MOCK_TASKS } from "@/lib/data-mock";

export default function DashboardPage() {
  const [filter, setFilter] = useState("all");

  // ฟังก์ชันสำหรับกรองข้อมูล (เพิ่มส่วนนี้เพื่อให้ Filter ทำงานจริง)
  const filteredTasks = MOCK_TASKS.filter((task) => {
    if (filter === "all") return true; // ถ้าเลือก all ให้แสดงทั้งหมด
    return task.status === filter;     // ถ้าเลือกอย่างอื่น ให้เช็ค status
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of your productivity.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95">
          + Create Task
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Tasks" value="24" icon={ListTodo} description="+2 from yesterday" />
        <StatCard title="Completed" value="12" icon={CheckCircle2} description="50% completion rate" />
        <StatCard title="In Progress" value="8" icon={Clock} description="3 tasks due soon" />
        <StatCard title="Overdue" value="4" icon={AlertCircle} description="Action needed!" className="border-rose-200 dark:border-rose-900/50" />
      </div>

      {/* Task List Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Tasks</h2>
          
          {/* 1. เปิดใช้งาน Component นี้ (เอา Comment ออก) เพื่อแก้ Error: declared but never used */}
          <TaskFilters current={filter} onChange={setFilter} /> 
        </div>
        
        <div className="flex flex-col gap-3">
          {/* 2. เช็คว่ามีข้อมูลหรือไม่ ก่อนแสดงผล */}
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TodoItem key={task.id} task={task} />
            ))
          ) : (
            // แสดงข้อความเมื่อไม่พบข้อมูลใน Filter นั้นๆ
            <div className="text-center py-12 text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
              <p>No tasks found for {filter} status.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}