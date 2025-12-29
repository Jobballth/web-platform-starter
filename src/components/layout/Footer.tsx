export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-6 px-8 mt-auto border-t border-slate-100 dark:border-slate-800/50">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Copyright Text */}
        <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
          &copy; {currentYear} <span className="text-indigo-600 dark:text-indigo-400 font-bold">Todolish</span>. All rights reserved.
        </p>

        {/* Links (Optional) */}
        <div className="flex items-center gap-6">
          <a href="#" className="text-xs font-medium text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-xs font-medium text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Terms of Service
          </a>
          <span className="text-xs text-slate-300 dark:text-slate-700">|</span>
          <span className="text-xs text-slate-400">v1.0.0</span>
        </div>

      </div>
    </footer>
  );
}