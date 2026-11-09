import { prisma } from '@/lib/prisma';
import BookingForm from '@/components/BookingForm';
import { CalendarCheck } from 'lucide-react';
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
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3">
          <CalendarCheck className="w-3.5 h-3.5" />
          Formulir Reservasi
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900">Pilih Jadwal Kunjungan Anda</h1>
        <p className="text-sm text-neutral-500 mt-2 max-w-lg mx-auto">
          Silakan tentukan layanan, tanggal yang diinginkan, dan lengkapi rincian kontak Anda.
        </p>
      </div>

      <BookingForm services={services} initialServiceId={initialServiceId} />
    </div>
  );
}

