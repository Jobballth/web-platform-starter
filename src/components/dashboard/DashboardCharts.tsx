"use client";

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

// ✅ 1. กำหนด Interface ให้กับ Task (ปรับตาม Schema จริงของคุณ)
interface Task {
  id?: string;
  priority: 'low' | 'medium' | 'high' | string;
  status: 'todo' | 'processing' | 'done' | string;
}

// ✅ 2. กำหนด Interface สำหรับ Props
interface DashboardChartsProps {
  tasks: Task[]; // เปลี่ยนจาก any[] เป็น Task[]
}

export default function DashboardCharts({ tasks }: DashboardChartsProps) {
  
  // 1. คำนวณข้อมูลสำหรับกราฟวงกลม (Priority)
  const priorityData = [
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#f43f5e' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#f97316' },
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#10b981' },
  ];

  // 2. คำนวณข้อมูลสำหรับกราฟแท่ง (Status Overview)
  const statusData = [
    { name: 'Pending', count: tasks.filter(t => t.status !== 'done').length },
    { name: 'Completed', count: tasks.filter(t => t.status === 'done').length },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* --- Pie Chart --- */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center">
        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4 w-full text-left">
          Tasks by Priority
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={priorityData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- Bar Chart --- */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">
          Task Status Overview
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData} layout="vertical" barSize={30}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={100} tick={{fill: '#64748b', fontSize: 14}} axisLine={false} tickLine={false}/>
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 10, 10, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-slate-400 mt-4 text-center">
          Compare your active tasks versus completed goals.
        </p>
      </div>

    </div>
  );
}