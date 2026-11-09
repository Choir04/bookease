import Link from 'next/link';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-neutral-800">BookEase System</span>
          </div>

          <p className="text-xs text-neutral-500 text-center flex items-center gap-1">
            Built with Next.js, Prisma ORM, and PostgreSQL. Ready for Vercel deployment.
          </p>

          <div className="flex items-center gap-6 text-xs text-neutral-500">
            <Link href="/" className="hover:text-indigo-600">Home</Link>
            <Link href="/book" className="hover:text-indigo-600">Reservasi</Link>
            <Link href="/check-status" className="hover:text-indigo-600">Cek Status</Link>
            <Link href="/admin" className="hover:text-indigo-600">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

