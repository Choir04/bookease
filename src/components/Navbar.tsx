import Link from 'next/link';
import { CalendarCheck, ShieldCheck, Search, Sparkles } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-neutral-900">
              Book<span className="text-indigo-600">Ease</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium">
              Studio & Spa
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-4">
          <Link
            href="/#services"
            className="text-sm font-medium text-neutral-600 hover:text-indigo-600 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Layanan
          </Link>
          <Link
            href="/check-status"
            className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-indigo-600 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Cek Status</span>
          </Link>
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard Admin</span>
          </Link>
          <Link
            href="/book"
            className="flex items-center gap-1.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl shadow-sm hover:shadow-indigo-200 transition-all active:scale-95"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Reservasi Sekarang</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

