"use client";

import { useState } from "react";
import { signIn } from "next-auth/react"; // ✅ 1. ใช้ signIn มาตรฐานของ NextAuth
import { useRouter } from "next/navigation"; // ✅ 2. ต้องใช้ router เพื่อเปลี่ยนหน้าเมื่อสำเร็จ
import Link from "next/link";
import { Eye, EyeOff, Loader2, Mail, Lock, LogIn, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // ✅ 3. เรียกใช้ signIn แบบ Client Side
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false, // ⚠️ สำคัญ: ตั้งเป็น false เพื่อไม่ให้มันดีดมั่ว (เราจะคุมเอง)
      });

      if (result?.error) {
        // กรณี Login พลาด: แสดง Error และหยุดหมุน
        console.error("Login Failed:", result.error);
        setError("Invalid email or password");
        setIsLoading(false);
      } else {
        // ✅ 4. กรณี Login สำเร็จ
        // router.refresh() สำคัญมาก! เพื่อให้ Server Component รู้ว่ามี Session แล้ว
        router.refresh(); 
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("System Error:", err);
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-[450px] bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 md:p-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-4">
            <LogIn size={24} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-2">Please enter your details to sign in.</p>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 flex items-start gap-3 animate-pulse">
            <AlertCircle className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-rose-600 dark:text-rose-300 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                name="email"
                type="email"
                required
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-800"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-500 hover:underline">Forgot password?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-[0.98] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign in
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center pt-6 border-t border-slate-100 dark:border-slate-800">
          <p className="text-sm text-slate-500">
            {"Don't have an account?"}{' '}
            <Link href="/auth/register" className="font-bold text-indigo-600 hover:text-indigo-500 hover:underline transition-all">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}