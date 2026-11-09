'use client';

import { Suspense, useState, useEffect, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { findBookingByCode } from '@/actions/booking';
import { formatRupiah } from '@/lib/utils';
import { Search, Calendar, Clock, AlertCircle, Loader2, Sparkles, Check, CheckCheck, X } from 'lucide-react';
import { BookingStatus } from '@prisma/client';

function CheckStatusContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code') || '';

  const [bookingCode, setBookingCode] = useState(initialCode);
  const [bookingData, setBookingData] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (codeToSearch: string) => {
    if (!codeToSearch.trim()) return;
    setErrorMsg(null);
    setBookingData(null);

    startTransition(async () => {
      const res = await findBookingByCode(codeToSearch);
      if (res.success && res.booking) {
        setBookingData(res.booking);
      } else {
        setErrorMsg(res.error || 'Reservasi tidak ditemukan');
      }
    });
  };

  useEffect(() => {
    if (initialCode) {
      handleSearch(initialCode);
    }
  }, [initialCode]);

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5" /> MENUNGGU KONFIRMASI ADMIN
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <Check className="w-3.5 h-3.5" /> JADWAL TELAH TERKONFIRMASI
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <CheckCheck className="w-3.5 h-3.5" /> KUNJUNGAN SELESAI
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
            <X className="w-3.5 h-3.5" /> DIBATALKAN
          </span>
        );
    }
  };

  return (
    <>
      {/* SEARCH BOX */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(bookingCode);
        }}
        className="flex gap-2 mb-8"
      >
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Ketik kode booking..."
            value={bookingCode}
            onChange={(e) => setBookingCode(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-300 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cek Status'}
        </button>
      </form>

      {/* ERROR VIEW */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 mb-6">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
          <div>
            <p className="font-semibold">{errorMsg}</p>
            <p className="text-xs text-red-600 mt-1">
              Pastikan Anda memasukkan kode dengan benar sesuai yang tertera pada konfirmasi reservasi.
            </p>
          </div>
        </div>
      )}

      {/* BOOKING DETAILS CARD */}
      {bookingData && (
        <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 overflow-hidden animate-fade-in">
          <div className="bg-neutral-900 text-white p-6 flex items-center justify-between">
            <div>
              <span className="text-xs text-neutral-400 uppercase tracking-widest block font-medium">Status Pesanan</span>
              <span className="text-xl font-bold font-mono tracking-wider">{bookingData.bookingCode}</span>
            </div>
            <div>{getStatusBadge(bookingData.status)}</div>
          </div>

          <div className="p-6 space-y-4 text-sm">
            <div className="flex justify-between items-start border-b border-neutral-100 pb-3">
              <span className="text-neutral-500">Layanan:</span>
              <span className="font-bold text-neutral-900 text-right">{bookingData.service?.name}</span>
            </div>

            <div className="flex justify-between items-start border-b border-neutral-100 pb-3">
              <span className="text-neutral-500">Tanggal Kunjungan:</span>
              <span className="font-medium text-neutral-900 text-right">
                {new Date(bookingData.date).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            <div className="flex justify-between items-start border-b border-neutral-100 pb-3">
              <span className="text-neutral-500">Jam Slot:</span>
              <span className="font-medium text-neutral-900 text-right">
                {bookingData.startTime} - {bookingData.endTime} WIB
              </span>
            </div>

            <div className="flex justify-between items-start border-b border-neutral-100 pb-3">
              <span className="text-neutral-500">Nama Pelanggan:</span>
              <span className="font-medium text-neutral-900 text-right">{bookingData.customerName}</span>
            </div>

            <div className="flex justify-between items-start border-b border-neutral-100 pb-3">
              <span className="text-neutral-500">WhatsApp / Kontak:</span>
              <span className="font-medium text-neutral-900 text-right">{bookingData.customerPhone}</span>
            </div>

            {bookingData.notes && (
              <div className="flex justify-between items-start border-b border-neutral-100 pb-3">
                <span className="text-neutral-500">Catatan Khusus:</span>
                <span className="font-medium text-neutral-700 italic text-right">"{bookingData.notes}"</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <span className="font-semibold text-neutral-900">Total Biaya:</span>
              <span className="text-xl font-bold text-indigo-600">{formatRupiah(bookingData.totalPrice)}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function CheckStatusPage() {
  return (
    <div className="py-12 sm:py-16 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3">
          <Search className="w-3.5 h-3.5" />
          Pelacakan Mandiri
        </div>
        <h1 className="text-3xl font-extrabold text-neutral-900">Cek Status Reservasi</h1>
        <p className="text-sm text-neutral-500 mt-2">
          Masukkan Kode Booking unik Anda (contoh: <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-neutral-700">BK-202611-101</code>)
        </p>
      </div>

      <Suspense fallback={<div className="text-center py-8 text-neutral-400">Memuat formulir...</div>}>
        <CheckStatusContent />
      </Suspense>
    </div>
  );
}
