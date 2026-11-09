'use client';

import { useState, useTransition } from 'react';
import { updateBookingStatus } from '@/actions/booking';
import { formatRupiah } from '@/lib/utils';
import { BookingStatus } from '@prisma/client';
import {
  Check,
  X,
  CheckCheck,
  Clock,
  Search,
  Phone,
  Mail,
  Calendar,
  Loader2,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';

interface BookingRecord {
  id: string;
  bookingCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: Date | string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: BookingStatus;
  notes?: string | null;
  service: {
    name: string;
  };
}

export default function AdminBookingList({ initialBookings }: { initialBookings: BookingRecord[] }) {
  const [filter, setFilter] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  const filteredBookings = initialBookings.filter((b) => {
    const matchesFilter = filter === 'ALL' || b.status === filter;
    const matchesSearch =
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
      b.service.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    setActiveActionId(bookingId);
    startTransition(async () => {
      await updateBookingStatus(bookingId, newStatus);
      setActiveActionId(null);
    });
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> PENDING
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> TERKONFIRMASI
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCheck className="w-3.5 h-3.5 text-blue-500" /> SELESAI
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <X className="w-3.5 h-3.5 text-rose-500" /> DIBATALKAN
          </span>
        );
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
      {/* HEADER FILTER TABS & SEARCH */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
        {/* TABS */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {(['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const).map((tab) => {
            const count = tab === 'ALL' ? initialBookings.length : initialBookings.filter((b) => b.status === tab).length;
            const isActive = filter === tab;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                <span>{tab === 'ALL' ? 'Semua' : tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* SEARCH */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Cari kode, nama pemesan, atau layanan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50/80 border-b border-slate-200 uppercase font-extrabold text-slate-400 tracking-wider text-[10px]">
            <tr>
              <th className="px-6 py-4">Kode & Layanan</th>
              <th className="px-6 py-4">Pelanggan</th>
              <th className="px-6 py-4">Jadwal Sesi</th>
              <th className="px-6 py-4">Total Biaya</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-14 text-slate-400 italic">
                  Tidak ada data reservasi yang cocok dengan kriteria pencarian.
                </td>
              </tr>
            ) : (
              filteredBookings.map((b) => {
                const isLoading = isPending && activeActionId === b.id;

                let cleanPhone = b.customerPhone.replace(/\D/g, '');
                if (cleanPhone.startsWith('0')) {
                  cleanPhone = '62' + cleanPhone.slice(1);
                }

                const waReminderMessage = encodeURIComponent(
                  `Halo Kak ${b.customerName}, kami dari BookEase ingin mengonfirmasi jadwal kunjungan Anda:\n\n` +
                  `*Kode Booking:* ${b.bookingCode}\n` +
                  `*Layanan:* ${b.service.name}\n` +
                  `*Waktu:* ${b.startTime} - ${b.endTime} WIB\n` +
                  `*Status:* ${b.status}\n\n` +
                  `Mohon hadir 10 menit sebelum jadwal. Jika ada perubahan mohon kabari kami. Terima kasih!`
                );

                return (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* KODE & LAYANAN */}
                    <td className="px-6 py-4.5">
                      <span className="font-mono font-extrabold text-indigo-600 block text-xs">
                        {b.bookingCode}
                      </span>
                      <span className="text-slate-900 font-bold text-sm block mt-0.5">{b.service.name}</span>
                      {b.notes && (
                        <p className="text-[11px] text-slate-400 mt-1 italic max-w-xs truncate">
                          "{b.notes}"
                        </p>
                      )}
                    </td>

                    {/* PELANGGAN WITH AVATAR */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                          {getInitials(b.customerName)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 text-xs block">{b.customerName}</span>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                            <span className="truncate max-w-[140px]">{b.customerEmail}</span>
                            {cleanPhone && (
                              <a
                                href={`https://wa.me/${cleanPhone}?text=${waReminderMessage}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-600 hover:text-emerald-700 font-bold inline-flex items-center gap-0.5"
                                title="Chat WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" /> WA
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* JADWAL */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(b.date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="text-[11px] font-semibold text-indigo-600 mt-0.5">
                        {b.startTime} - {b.endTime} WIB
                      </div>
                    </td>

                    {/* BIAYA */}
                    <td className="px-6 py-4.5 font-extrabold text-slate-900 text-sm">
                      {formatRupiah(b.totalPrice)}
                    </td>

                    {/* STATUS BADGE */}
                    <td className="px-6 py-4.5">{getStatusBadge(b.status)}</td>

                    {/* AKSI BUTTONS */}
                    <td className="px-6 py-4.5 text-right">
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-slate-400 inline" />
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          {b.status === 'PENDING' && (
                            <button
                              onClick={() => handleStatusChange(b.id, 'CONFIRMED')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold transition shadow-xs active:scale-95 flex items-center gap-1"
                              title="Konfirmasi Reservasi"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Konfirmasi</span>
                            </button>
                          )}

                          {b.status === 'CONFIRMED' && (
                            <button
                              onClick={() => handleStatusChange(b.id, 'COMPLETED')}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-bold transition shadow-xs active:scale-95 flex items-center gap-1"
                              title="Tandai Selesai"
                            >
                              <CheckCheck className="w-3.5 h-3.5" />
                              <span>Selesai</span>
                            </button>
                          )}

                          {b.status !== 'CANCELLED' && b.status !== 'COMPLETED' && (
                            <button
                              onClick={() => handleStatusChange(b.id, 'CANCELLED')}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-xl text-[11px] font-semibold transition active:scale-95"
                              title="Batalkan Reservasi"
                            >
                              Batal
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
