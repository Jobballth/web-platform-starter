import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header"; // ✅ นำ Header กลับมา

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* 1. Sidebar อยู่ซ้ายสุดคงที่ */}
      <Sidebar />
      
      {/* 2. ส่วนขวา: แบ่งเป็นบน (Header) และล่าง (Content) */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* ✅ วาง Header ไว้ด้านบนของส่วนเนื้อหา */}
        <Header /> 

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}