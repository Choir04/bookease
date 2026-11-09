'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarCheck, ShieldCheck, Search, Sparkles, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full glass-nav backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 group-hover:scale-105 transition-all duration-300">
              <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Book<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Ease</span>
              </span>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/50">
                Studio & Spa
              </span>
            </div>
            <p className="hidden sm:block text-[10px] text-slate-400 font-medium">Real-time Online Booking</p>
          </div>
        </Link>

        {/* NAVIGATION LINKS */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/#services"
            className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-xl hover:bg-slate-100/70 transition-all"
          >
            Layanan
          </Link>

          <Link
            href="/check-status"
            className={`flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3 py-2 rounded-xl transition-all ${
              pathname === '/check-status'
                ? 'bg-indigo-50 text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/70'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Cek Status</span>
          </Link>

          <Link
            href="/admin"
            className={`flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3 py-2 rounded-xl transition-all ${
              pathname === '/admin'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </Link>

          <Link
            href="/book"
            className="ml-2 flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 px-4 py-2.5 rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Booking</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-80" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
