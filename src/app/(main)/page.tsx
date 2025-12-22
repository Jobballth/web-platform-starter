import Link from "next/link";
import { ArrowRight, CheckCircle2, Layout, ShieldCheck } from "lucide-react";


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      
      {/* 1. Navbar: แถบเมนูด้านบน */}
      <nav className="border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-indigo-600 tracking-tighter flex items-center gap-2">
            <Layout className="w-6 h-6" />
            Todolish
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/auth/login" 
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/auth/register" 
              className="text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section: ส่วนหัวข้อใหญ่ */}
      <main className="max-w-6xl mx-auto px-4 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 text-xs font-bold mb-6 border border-indigo-100 dark:border-indigo-800">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          v1.0 is now live
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white tracking-tight mb-6">
          Organize your work <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600">
            One task at a time.
          </span>
        </h1>
        
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Todolish is the simple, elegant way to manage your tasks. 
          Built with Next.js 15, Prisma, and PostgreSQL for maximum performance.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/auth/register"
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform"
          >
            Start for free <ArrowRight size={18} />
          </Link>
          <Link 
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            View Demo
          </Link>
        </div>

        {/* 3. Features Grid: คุณสมบัติเด่น */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 text-left">
          {[
            { title: "Secure Authentication", desc: "Powered by BCrypt & Cookies", icon: ShieldCheck },
            { title: "Real-time Database", desc: "Sync with PostgreSQL instantly", icon: Layout },
            { title: "Modern Dashboard", desc: "Clean UI built with Tailwind", icon: CheckCircle2 },
          ].map((item, i) => (
            <div key={i} className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 transition-colors">
              <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-indigo-600 mb-4 shadow-sm">
                <item.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>

    </div>
  );
}