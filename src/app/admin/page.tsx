import { prisma } from '@/lib/prisma';
import { formatRupiah } from '@/lib/utils';
import AdminBookingList from '@/components/AdminBookingList';
import { Calendar, Clock, DollarSign, CheckCircle2, ShieldCheck, Sparkles, TrendingUp, Plus } from 'lucide-react';
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
    <div className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* DASHBOARD TOP HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold mb-3 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Admin Console</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Reservasi & Jadwal
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Pantau pipeline reservasi pelanggan dan kelola status jadwal secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/book"
            className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold rounded-2xl transition shadow-md shadow-indigo-500/25 flex items-center gap-2 active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Input Booking Baru</span>
          </Link>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {/* CARD 1: PENDING */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-center justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform" />
          <div className="relative z-10">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Menunggu Approval
            </span>
            <span className="text-3xl font-extrabold text-amber-600 mt-2 block tracking-tight">
              {pendingCount}
            </span>
            <span className="text-[11px] font-semibold text-amber-700/80 bg-amber-50 px-2 py-0.5 rounded-md inline-block mt-1">
              Perlu tindak lanjut
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center relative z-10 shadow-inner">
            <Clock className="w-7 h-7" />
          </div>
        </div>

        {/* CARD 2: TODAY BOOKINGS */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-center justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform" />
          <div className="relative z-10">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Jadwal Hari Ini
            </span>
            <span className="text-3xl font-extrabold text-slate-900 mt-2 block tracking-tight">
              {todayBookings.length}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 inline-block mt-1">
              Sesi terdaftar hari ini
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center relative z-10 shadow-inner">
            <Calendar className="w-7 h-7" />
          </div>
        </div>

        {/* CARD 3: CONFIRMED & COMPLETED */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-center justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform" />
          <div className="relative z-10">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Terkonfirmasi & Selesai
            </span>
            <span className="text-3xl font-extrabold text-emerald-600 mt-2 block tracking-tight">
              {confirmedCount + completedCount}
            </span>
            <span className="text-[11px] font-semibold text-emerald-700/80 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-1">
              Dari {totalBookings} total pesanan
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center relative z-10 shadow-inner">
            <CheckCircle2 className="w-7 h-7" />
          </div>
        </div>

        {/* CARD 4: ESTIMATED REVENUE */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-center justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-violet-50 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform" />
          <div className="relative z-10">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Estimasi Omzet
            </span>
            <span className="text-2xl font-extrabold text-indigo-600 mt-2 block tracking-tight">
              {formatRupiah(totalRevenue)}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-emerald-500" /> Transaksi valid
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center relative z-10 shadow-inner">
            <DollarSign className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* MAIN TABLE SECTION */}
      <div className="mb-14">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Manajemen Antrean Reservasi</h2>
            <p className="text-xs text-slate-400">Sinkronisasi instan via Next.js Server Actions</p>
          </div>
        </div>
        <AdminBookingList initialBookings={bookings} />
      </div>

      {/* SERVICE CATALOG SECTION (ADMIN VIEW) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Katalog Layanan Aktif ({services.length})</h3>
              <p className="text-xs text-slate-400">Tersedia pada formulir reservasi publik</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <div
              key={s.id}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-indigo-200 transition-all text-xs"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-extrabold text-slate-900 text-sm">{s.name}</span>
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">
                  {formatRupiah(s.price)}
                </span>
              </div>
              <p className="text-slate-500 line-clamp-2 mb-3 leading-relaxed">{s.description}</p>
              <div className="flex items-center justify-between text-slate-400 text-[11px] pt-3 border-t border-slate-200/60">
                <span className="flex items-center gap-1 font-semibold">
                  <Clock className="w-3 h-3 text-slate-400" /> {s.durationMinutes} Menit
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Aktif
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
