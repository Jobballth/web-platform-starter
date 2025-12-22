import { 
  Check, 
  Clock, 
  LayoutDashboard, 
  Trash2,
  Undo2,
  CalendarDays,
  MoreHorizontal,
  Layers
} from "lucide-react";
import CreateTaskModal from "@/components/todo/CreateTaskModal";
import { db } from "@/lib/db";
import { getAuthUser, toggleTaskStatus, deleteTask } from "./actions";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  gradient: string; // ✅ เพิ่มลูกเล่นสี Gradient
}

export default async function DashboardPage() {
  const user = await getAuthUser();
  
  const [total, completed, pending, recentTasks] = await Promise.all([
    db.task.count({ where: { userId: user?.id } }),
    db.task.count({ where: { userId: user?.id, status: "completed" } }),
    db.task.count({ where: { userId: user?.id, status: "todo" } }),
    db.task.findMany({
      where: { userId: user?.id },
      orderBy: { createdAt: "desc" },
      take: 10 
    })
  ]);

  return (
    <div className="max-w-5xl mx-auto p-8 min-h-screen bg-slate-50 dark:bg-[#0B1120]">
      {/* --- Header --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">
            Welcome back, <span className="text-indigo-600 dark:text-indigo-400">{user?.fullName || 'User'}</span> 👋
          </p>
        </div>
        <div className="shadow-xl shadow-indigo-500/20 rounded-2xl">
          <CreateTaskModal />
        </div>
      </header>

      {/* --- Stats Cards (Premium Style) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard 
          title="All Tasks" 
          value={total} 
          icon={<Layers className="text-white" size={24} />} 
          gradient="from-blue-500 to-indigo-600"
        />
        <StatCard 
          title="Completed" 
          value={completed} 
          icon={<Check className="text-white" size={24} />} 
          gradient="from-emerald-400 to-teal-500"
        />
        <StatCard 
          title="Pending" 
          value={pending} 
          icon={<Clock className="text-white" size={24} />} 
          gradient="from-orange-400 to-pink-500"
        />
      </div>

      {/* --- Recent Activity Section --- */}
      <div className="bg-white dark:bg-slate-900 rounded-4xl border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <CalendarDays size={20} className="text-indigo-500"/>
            Recent Tasks
          </h2>
          <button className="text-slate-400 hover:text-indigo-600 transition-colors">
            <MoreHorizontal size={24} />
          </button>
        </div>
        
        {recentTasks.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <LayoutDashboard className="text-indigo-400" size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No tasks found</h3>
            <p className="text-slate-500 max-w-xs mx-auto">
              Your dashboard is clean! Start by creating a new task to track your progress.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentTasks.map((task) => (
              <div 
                key={task.id} 
                className="group p-6 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all duration-300"
              >
                <div className="flex items-center gap-5 overflow-hidden">
                  {/* ปุ่มเปลี่ยนสถานะแบบ Checkbox เท่ๆ */}
                  <form action={async () => {
                    "use server";
                    await toggleTaskStatus(task.id, task.status);
                  }}>
                    <button className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      task.status === 'completed' 
                      ? 'bg-emerald-500 border-emerald-500 scale-110 shadow-lg shadow-emerald-500/30' 
                      : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 text-transparent'
                    }`}>
                      <Check size={16} className={`text-white transition-transform duration-300 ${
                         task.status === 'completed' ? 'scale-100' : 'scale-0'
                      }`} strokeWidth={3} />
                    </button>
                  </form>
                  
                  {/* รายละเอียดงาน */}
                  <div className="flex flex-col gap-1 min-w-0">
                    <p className={`font-bold text-base transition-all duration-300 truncate ${
                      task.status === 'completed' 
                      ? 'text-slate-400 line-through decoration-slate-400/50 decoration-2' 
                      : 'text-slate-800 dark:text-slate-200'
                    }`}>
                      {task.title}
                    </p>
                    
                    <div className="flex items-center gap-3">
                      {/* Priority Badge */}
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                        task.priority === 'high' ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-900/20 dark:border-rose-800' : 
                        task.priority === 'medium' ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-900/20 dark:border-amber-800' : 
                        'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800'
                      }`}>
                        {task.priority}
                      </span>
                      
                      <p className="text-xs text-slate-400 line-clamp-1 truncate max-w-[200px] md:max-w-md">
                        {task.description || 'No additional details'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions Group (จะโชว์เมื่อ Hover) */}
                <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out pl-4">
                  
                  {/* ปุ่ม Undo (แสดงเฉพาะตอนเสร็จ) */}
                  {task.status === 'completed' && (
                    <form action={async () => {
                      "use server";
                      await toggleTaskStatus(task.id, task.status);
                    }}>
                      <button className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-white transition-colors" title="Undo">
                        <Undo2 size={18} />
                      </button>
                    </form>
                  )}

                  {/* ปุ่มลบ (สีแดงแสบตาเมื่อ Hover) */}
                  <form action={async () => {
                    "use server";
                    await deleteTask(task.id);
                  }}>
                    <button className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-600 hover:border-rose-200 transition-all duration-200 shadow-sm hover:shadow-md" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ Premium StatCard Component
function StatCard({ title, value, icon, gradient }: StatCardProps) {
  return (
    <div className="relative group overflow-hidden bg-white dark:bg-slate-800 p-6 rounded-4xl border border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="flex justify-between items-start relative z-10">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">{title}</span>
          <h3 className="text-4xl font-black text-slate-800 dark:text-white mt-2">{value}</h3>
        </div>
        
        {/* Icon Container with Gradient */}
        <div className={`p-4 rounded-2xl bg-linear-to-br ${gradient} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>

      {/* Background Decor (วงกลมจางๆ ด้านหลัง) */}
      <div className={`absolute -bottom-4 -right-4 w-32 h-32 bg-linear-to-br ${gradient} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity duration-500`} />
    </div>
  ); 
}