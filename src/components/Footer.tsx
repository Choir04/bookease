import Link from 'next/link';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 tracking-tight">BookEase Studio</span>
              <p className="text-[11px] text-slate-400">Appointment & Reservation Management</p>
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center flex items-center gap-1.5 font-medium">
            Next.js 16 • Prisma ORM • Serverless PostgreSQL • Vercel
          </p>

          <div className="flex items-center gap-6 text-xs font-semibold text-slate-500">
            <Link href="/" className="hover:text-indigo-600 transition-colors">
              Beranda
            </Link>
            <Link href="/book" className="hover:text-indigo-600 transition-colors">
              Reservasi
            </Link>
            <Link href="/check-status" className="hover:text-indigo-600 transition-colors">
              Cek Tiket
            </Link>
            <Link href="/admin" className="hover:text-indigo-600 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
