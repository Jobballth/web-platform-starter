export type Priority = "low" | "medium" | "high";
export type Status = "todo" | "in-progress" | "completed";

export interface Task {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  date: string;
}

export const MOCK_TASKS: Task[] = [
  { id: "1", title: "Review Next.js 14 Features", status: "todo", priority: "high", date: "Today" },
  { id: "2", title: "Design System Implementation", status: "in-progress", priority: "medium", date: "Tomorrow" },
  { id: "3", title: "Fix Navigation Bug", status: "completed", priority: "low", date: "Yesterday" },
  { id: "4", title: "Meeting with Client", status: "todo", priority: "high", date: "Fri, 22" },
];

// ข้อมูลสำหรับ StatCard
export const STATS_DATA = [
  { label: "Total Tasks", value: 24, trend: "+12%", status: "neutral" },
  { label: "Completed", value: 18, trend: "+5%", status: "success" },
  { label: "In Progress", value: 4, trend: "-2%", status: "warning" },
  { label: "Overdue", value: 2, trend: "+1", status: "danger" },
];