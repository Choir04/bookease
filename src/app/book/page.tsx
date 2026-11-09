import { prisma } from '@/lib/prisma';
import BookingForm from '@/components/BookingForm';
import { CalendarCheck, Sparkles, ShieldCheck } from 'lucide-react';
import { Service } from '@prisma/client';

interface BookPageProps {
  searchParams: Promise<{ service?: string }>;
}

export default async function BookPage({ searchParams }: BookPageProps) {
  const { service: initialServiceId } = await searchParams;

  let services: Service[] = [];
  try {
    services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });
  } catch (error) {
    console.error('Failed to load services:', error);
  }

  return (
    <div className="py-14 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      {/* Decorative ambient background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/50 text-indigo-700 text-xs font-bold mb-4 shadow-xs">
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Formulir Reservasi Mandiri</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Pilih Jadwal Kunjungan Anda
        </h1>
        <p className="text-sm sm:text-base text-slate-500 mt-3 max-w-lg mx-auto">
          Tentukan paket perawatan, hari dan jam kedatangan, serta lengkapi data pemesanan secara instan.
        </p>

        {/* Guarantees bar */}
        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-slate-400 font-semibold">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Slot Real-Time
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-500" /> Bebas Antre
          </span>
        </div>
      </div>

      <BookingForm services={services} initialServiceId={initialServiceId} />
    </div>
  );
}
