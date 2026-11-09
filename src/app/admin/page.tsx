import { prisma } from '@/lib/prisma';
import { formatRupiah } from '@/lib/utils';
import AdminBookingList from '@/components/AdminBookingList';
import { Calendar, Clock, DollarSign, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  let bookings: any[] = [];
  let services: any[] = [];

  try {
    [bookings, services] = await Promise.all([
      prisma.booking.findMany({
        orderBy: [{ date: 'desc' }, { startTime: 'desc' }],
        include: { service: true },
      }),
      prisma.service.findMany({
        orderBy: { price: 'asc' },
      }),
    ]);
  } catch (error) {
    console.error('Failed to load admin data:', error);
  }

  // Calculate Metrics
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalBookings = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === 'PENDING').length;
  const confirmedCount = bookings.filter((b) => b.status === 'CONFIRMED').length;
  const completedCount = bookings.filter((b) => b.status === 'COMPLETED').length;

  const todayBookings = bookings.filter((b) => {
    const bDate = new Date(b.date);
    bDate.setHours(0, 0, 0, 0);
    return bDate.getTime() === today.getTime();
  });

  const totalRevenue = bookings
    .filter((b) => b.status === 'COMPLETED' || b.status === 'CONFIRMED')
    .reduce((acc, curr) => acc + curr.totalPrice, 0);

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            Panel Manajemen
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">Dashboard Reservasi & Jadwal</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Pantau dan kelola antrean booking pelanggan secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/book"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition shadow-sm"
          >
            + Reservasi Baru
          </Link>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* CARD 1: PENDING */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-neutral-500 block">Menunggu Konfirmasi</span>
            <span className="text-2xl font-bold text-amber-600 mt-1 block">{pendingCount}</span>
            <span className="text-[11px] text-neutral-400">Perlu tindak lanjut admin</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* CARD 2: TODAY BOOKINGS */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-neutral-500 block">Jadwal Hari Ini</span>
            <span className="text-2xl font-bold text-neutral-900 mt-1 block">{todayBookings.length}</span>
            <span className="text-[11px] text-neutral-400">Total reservasi hari ini</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* CARD 3: TOTAL BOOKINGS */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-neutral-500 block">Terkonfirmasi & Selesai</span>
            <span className="text-2xl font-bold text-emerald-600 mt-1 block">
              {confirmedCount + completedCount}
            </span>
            <span className="text-[11px] text-neutral-400">Dari {totalBookings} total pesanan</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* CARD 4: REVENUE */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-neutral-500 block">Estimasi Omzet</span>
            <span className="text-xl font-bold text-indigo-600 mt-1 block">{formatRupiah(totalRevenue)}</span>
            <span className="text-[11px] text-neutral-400">Dari order terkonfirmasi/selesai</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* MAIN BOOKING TABLE */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-neutral-900">Daftar Semua Reservasi</h2>
          <span className="text-xs text-neutral-400">Auto-refresh saat aksi dilakukan</span>
        </div>
        <AdminBookingList initialBookings={bookings} />
      </div>

      {/* SERVICES SUMMARY LIST */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Katalog Layanan Aktif ({services.length})
          </h3>
          <span className="text-xs text-neutral-400">Dikelola via Database Service</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <div key={s.id} className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-neutral-900 text-sm">{s.name}</span>
                <span className="font-semibold text-indigo-600">{formatRupiah(s.price)}</span>
              </div>
              <p className="text-neutral-500 line-clamp-2 mb-2">{s.description}</p>
              <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                <span>Durasi: {s.durationMinutes} menit</span>
                <span className="text-emerald-600 font-semibold">Aktif</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

