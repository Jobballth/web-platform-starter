import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // เปลี่ยน h-screen เป็น min-h-screen เพื่อความยืดหยุ่น
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      
      {/* 1. Sidebar: ควรมีกลไกซ่อนบน Mobile ภายในคอมโพเนนต์เอง */}
      <Sidebar />
      
      {/* 2. ส่วนขวา: จัดการให้ยืดเต็มที่และเลื่อนเฉพาะจุด */}
      <div className="flex flex-col flex-1 min-w-0">
        
        {/* Header อยู่บนสุดเสมอ */}
        <Header /> 

        {/* main: ส่วนนี้ต้อง scroll ได้ และควรกำหนดความกว้างให้เหมาะสม */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto w-full"> {/* เพิ่ม Container เพื่อความสวยงาม */}
            {children}
          </div>
          
          {/* ✅ ใส่ Footer ไว้ที่นี่ถ้าต้องการให้อยู่ท้ายเนื้อหา */}
          <Footer />
        </main>
      </div>
    </div>
  );
}