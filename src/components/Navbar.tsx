import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-blue-600">
          MyPlatform 🚀
        </Link>
        <div className="flex gap-4">
          <Link href="/" className="text-gray-600 hover:text-blue-600">
            Dashboard
          </Link>
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            U
          </div>
        </div>
      </div>
    </nav>
  );
}