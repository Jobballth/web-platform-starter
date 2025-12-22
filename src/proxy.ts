import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ✅ ต้องใช้ export default function เพื่อให้ Next.js มองเห็นเป็นฟังก์ชันหลัก
export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // 1. ดึง Token จาก Cookie (บัตรผ่าน)
  const token = request.cookies.get('token')?.value || '';

  // 2. ตรวจสอบสถานะ Path
  const isAuthPath = path.startsWith('/auth');
  const isDashboardPath = path.startsWith('/dashboard');

  // 3. กฎ: ถ้าจะเข้า Dashboard แต่ไม่มีบัตร -> ส่งไป Login
  if (isDashboardPath && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // 4. กฎ: ถ้ามีบัตรแล้วแต่อยากไปหน้า Login -> ส่งไป Dashboard
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// ✅ ส่วนของการกำหนดขอบเขต (Matcher) ยังเหมือนเดิม
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/auth/:path*',
  ],
};