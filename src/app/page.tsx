"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import TodoItem from "@/components/todo/TodoItem";
import AddTaskModal from "@/components/todo/AddTaskModal";
import { Plus } from "lucide-react";

// กำหนดประเภทข้อมูล
type TaskStatus = "done" | "todo" | "in-progress";

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate: string;
}

export default function TasksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleAddTask = (data: { title: string; dueDate: string }) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: data.title,
      dueDate: data.dueDate,
      status: "todo",
    };
    setTasks([...tasks, newTask]);
  };

  const handleToggle = (id: string) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, status: t.status === "done" ? "todo" : "done" } : t
    ));
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black">My Tasks</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} className="mr-2" /> New Task
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        {tasks.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {tasks.map((task) => (
              <TodoItem 
                key={task.id} 
                {...task} 
                onToggle={handleToggle} 
                onDelete={handleDelete} 
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400">ยังไม่มีรายการงาน</div>
        )}
      </Card>

      <AddTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddTask} 
      />
    </div>
  );
}