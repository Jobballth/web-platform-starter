"use client";

import React from 'react';
import { LayoutGrid, List, User, Settings, Bell, Search } from 'lucide-react';

export default function LayoutComparison() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      
      {/* --- 1. การใช้ FLEX ใน Navbar (จัดวางแนวนอน 1 มิติ) --- */}
      <nav className="flex items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
            <LayoutGrid size={20} />
          </div>
          <span className="font-black tracking-tighter text-xl">DASH.</span>
        </div>

        {/* Flex สำหรับเมนูที่ไหลต่อกัน */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
          <a href="#" className="text-indigo-600">Overview</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Analytics</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Reports</a>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-slate-900"><Bell size={20} /></button>
          <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
             <div className="w-full h-full bg-gradient-to-tr from-slate-400 to-slate-200" />
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* --- 2. การใช้ GRID ในส่วน Content (จัดวาง 2 มิติ) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: กินพื้นที่ 2 คอลัมน์ (Grid Feature) */}
          <div className="md:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden group">
            <div className="relative z-10">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-2">Main Statistics</h2>
              <p className="text-3xl font-black text-slate-900">$45,285.00</p>
              <p className="text-xs text-slate-400 mt-1">+12.5% from last month</p>
            </div>
            {/* กราฟจำลองด้วย Flex */}
            <div className="flex items-end gap-2 mt-8 h-24">
              {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                <div key={i} className="flex-1 bg-indigo-50 rounded-t-lg group-hover:bg-indigo-100 transition-colors" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          {/* Card 2: กินพื้นที่ 1 คอลัมน์ปกติ */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-between">
            <div>
              <Settings className="text-indigo-400 mb-4" />
              <h3 className="font-bold">System Health</h3>
              <p className="text-xs text-slate-500 mt-1">All systems operational</p>
            </div>
            <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-bold transition-all">
              View Logs
            </button>
          </div>

          {/* Card 3: รายการย่อยที่จัดด้วย Flex (แนวตั้ง) */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Recent Tasks</h3>
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  </div>
                  <div className="flex-1 border-b border-slate-50 pb-2">
                    <p className="text-sm font-bold text-slate-700">Update Report #{item}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Due in 2 hours</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Grid ภายใน Grid */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
             <div className="bg-emerald-500 p-6 rounded-[2rem] text-white">
                <p className="text-[10px] font-bold uppercase opacity-60">Active Users</p>
                <p className="text-2xl font-black">1,284</p>
             </div>
             <div className="bg-amber-400 p-6 rounded-[2rem] text-slate-900">
                <p className="text-[10px] font-bold uppercase opacity-60">Avg. Session</p>
                <p className="text-2xl font-black">04:22</p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}