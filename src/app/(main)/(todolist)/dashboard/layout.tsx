import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function TodolistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-black overflow-hidden">
      
      {/* 1. Sidebar (เมนูซ้าย) - จะโชว์ตลอดเวลา */}
      <Sidebar />

      {/* 2. Content Area (พื้นที่ขวา) */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header (แถบด้านบน) - จะโชว์ตลอดเวลา */}
        <Header />

        {/* Main Scrollable Area - พื้นที่เนื้อหาที่จะเปลี่ยนไปตามหน้า */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth">
          {children}
        </main>
      </div>
      
    </div>
  );
}