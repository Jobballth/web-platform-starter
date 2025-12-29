import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; 

// สร้าง handler สำหรับจัดการทั้ง GET และ POST requests
const handler = NextAuth(authOptions);

// ส่งออก handler ในรูปแบบที่ Next.js App Router ต้องการ
export { handler as GET, handler as POST };