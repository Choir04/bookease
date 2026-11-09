'use client';

import { useState, useTransition } from 'react';
import { updateBookingStatus } from '@/actions/booking';
import { formatRupiah } from '@/lib/utils';
import { BookingStatus } from '@prisma/client';
import { Check, X, CheckCheck, Clock, Search, Phone, Mail, Calendar, Loader2 } from 'lucide-react';

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
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> PENDING
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Check className="w-3 h-3" /> TERKONFIRMASI
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCheck className="w-3 h-3" /> SELESAI
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <X className="w-3 h-3" /> DIBATALKAN
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
      {/* HEADER FILTER & SEARCH */}
      <div className="p-4 sm:p-6 border-b border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* TABS */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {(['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const).map((tab) => {
            const count = tab === 'ALL' ? initialBookings.length : initialBookings.filter((b) => b.status === tab).length;
            const isActive = filter === tab;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {tab === 'ALL' ? 'Semua' : tab} ({count})
              </button>
            );
          })}
        </div>

        {/* SEARCH */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Cari kode, nama, atau layanan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-neutral-600">
          <thead className="bg-neutral-50 border-b border-neutral-200 uppercase font-semibold text-neutral-500 tracking-wider">
            <tr>
              <th className="px-6 py-3.5">Kode & Layanan</th>
              <th className="px-6 py-3.5">Pelanggan</th>
              <th className="px-6 py-3.5">Jadwal</th>
              <th className="px-6 py-3.5">Total Biaya</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-neutral-400 italic">
                  Tidak ada data reservasi yang cocok dengan kriteria pencarian.
                </td>
              </tr>
            ) : (
              filteredBookings.map((b) => {
                const isLoading = isPending && activeActionId === b.id;
                return (
                  <tr key={b.id} className="hover:bg-neutral-50/70 transition-colors">
                    {/* KODE & LAYANAN */}
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-indigo-600 block">{b.bookingCode}</span>
                      <span className="text-neutral-900 font-semibold">{b.service.name}</span>
                      {b.notes && <p className="text-[11px] text-neutral-400 mt-1 italic">"{b.notes}"</p>}
                    </td>

                    {/* PELANGGAN */}
                    <td className="px-6 py-4 space-y-0.5">
                      <span className="font-semibold text-neutral-900 block">{b.customerName}</span>
                      <div className="flex items-center gap-1 text-[11px] text-neutral-500">
                        <Mail className="w-3 h-3" /> {b.customerEmail}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-neutral-500">
                        <Phone className="w-3 h-3" /> {b.customerPhone}
                      </div>
                    </td>

                    {/* JADWAL */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 font-medium text-neutral-900">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                        {new Date(b.date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        {b.startTime} - {b.endTime}
                      </div>
                    </td>

                    {/* BIAYA */}
                    <td className="px-6 py-4 font-bold text-neutral-900">{formatRupiah(b.totalPrice)}</td>

                    {/* STATUS BADGE */}
                    <td className="px-6 py-4">{getStatusBadge(b.status)}</td>

                    {/* AKSI BUTTONS */}
                    <td className="px-6 py-4 text-right">
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-neutral-400 inline" />
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          {b.status === 'PENDING' && (
                            <button
                              onClick={() => handleStatusChange(b.id, 'CONFIRMED')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[11px] font-medium transition"
                              title="Konfirmasi Reservasi"
                            >
                              Konfirmasi
                            </button>
                          )}

                          {b.status === 'CONFIRMED' && (
                            <button
                              onClick={() => handleStatusChange(b.id, 'COMPLETED')}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[11px] font-medium transition"
                              title="Tandai Selesai"
                            >
                              Selesai
                            </button>
                          )}

                          {b.status !== 'CANCELLED' && b.status !== 'COMPLETED' && (
                            <button
                              onClick={() => handleStatusChange(b.id, 'CANCELLED')}
                              className="px-2 py-1 bg-neutral-100 hover:bg-rose-50 hover:text-rose-600 text-neutral-600 rounded-md text-[11px] font-medium transition"
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

