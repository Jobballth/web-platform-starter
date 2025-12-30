import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 min-w-0">
        <Header /> 

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {/* ❌ จุดที่ผิด: <div className="max-w-7xl mx-auto w-full"> */}
          {/* ✅ แก้เป็น: ใช้ max-w-none เพื่อให้กว้างเต็มพื้นที่ */}
          <div className="max-w-none mx-auto w-full"> 
            {children}
          </div>
          
          <Footer />
        </main>
      </div>
    </div>
  );
}