"use client";

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

// ✅ 1. ปรับ Interface ให้ยืดหยุ่นรองรับค่าจาก Prisma (มักจะเป็นตัวพิมพ์ใหญ่)
interface Task {
  id?: string;
  priority: string; // รองรับ HIGH, MEDIUM, LOW จาก DB
  status: string;   // รองรับ TODO, DONE, IN_PROGRESS จาก DB
}

interface DashboardChartsProps {
  tasks: Task[];
}

export default function DashboardCharts({ tasks }: DashboardChartsProps) {
  
  // ✅ 2. คำนวณข้อมูลโดยใช้ .toUpperCase() เพื่อป้องกันปัญหาตัวพิมพ์เล็ก-ใหญ่ไม่ตรงกัน
  const priorityData = [
    { name: 'High', value: tasks.filter(t => t.priority.toUpperCase() === 'HIGH').length, color: '#f43f5e' },
    { name: 'Medium', value: tasks.filter(t => t.priority.toUpperCase() === 'MEDIUM').length, color: '#f97316' },
    { name: 'Low', value: tasks.filter(t => t.priority.toUpperCase() === 'LOW').length, color: '#10b981' },
  ];

  const statusData = [
    { name: 'Pending', count: tasks.filter(t => t.status.toUpperCase() !== 'DONE').length },
    { name: 'Completed', count: tasks.filter(t => t.status.toUpperCase() === 'DONE').length },
  ];

  // ✅ 3. เช็คกรณีไม่มีข้อมูล (Empty State) เพื่อไม่ให้กราฟดูโล่งเกินไป
  const hasTasks = tasks.length > 0;

  if (!hasTasks) {
    return (
      <div className="bg-white dark:bg-slate-900 p-12 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800 text-center">
        <p className="text-slate-500">No data available to display charts. Start by adding some tasks!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      
      {/* --- Pie Chart: Priority Distribution --- */}
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
                animationDuration={1000}
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  backgroundColor: '#fff' 
                }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- Bar Chart: Status Overview --- */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">
          Task Status Overview
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData} layout="vertical" barSize={32} margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" opacity={0.5} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={100} 
                tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} 
                axisLine={false} 
                tickLine={false}
              />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 10, 10, 0]} animationDuration={1500} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-slate-400 mt-4 text-center italic">
          Compare your active tasks versus completed goals.
        </p>
      </div>

    </div>
  );
}