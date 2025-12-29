import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // ✅ กฎ: ถ้ามี Token แล้ว (Login แล้ว) แต่พยายามเข้าหน้า Auth
    // ให้ดีดไป Dashboard เลย (คน Login แล้วไม่ควรเห็นหน้า Login อีก)
    if (path.startsWith("/auth") && token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // ✅ แก้ไขจุดตาย: ถ้า user เข้าหน้า "/auth/..." ให้ผ่านได้เลยไม่ต้องเช็ค token
        // เพื่อป้องกัน Redirect Loop (คนไม่มีสิทธิ์ต้องเข้าหน้า Login ได้)
        if (path.startsWith("/auth")) {
          return true;
        }

        // สำหรับหน้าอื่นๆ (Dashboard, Task) ต้องมี Token เท่านั้น
        return !!token;
      },
    },
    pages: {
      signIn: "/auth/login",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/task/:path*",    
    "/settings/:path*",
    "/auth/:path*", // ใส่ไว้ได้ แต่ต้องเขียนดักใน authorized แบบด้านบน
  ],
};