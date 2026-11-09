'use client';

import { Suspense, useState, useEffect, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { findBookingByCode } from '@/actions/booking';
import { formatRupiah } from '@/lib/utils';
import {
  Search,
  Calendar,
  Clock,
  AlertCircle,
  Loader2,
  Sparkles,
  Check,
  CheckCheck,
  X,
  Printer,
  MessageCircle,
  Copy,
  ChevronRight,
  User,
  Phone,
} from 'lucide-react';
import { BookingStatus } from '@prisma/client';

function CheckStatusContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code') || '';

  const [bookingCode, setBookingCode] = useState(initialCode);
  const [bookingData, setBookingData] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [copiedCode, setCopiedCode] = useState(false);

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

  const copyBookingCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
            <Clock className="w-3.5 h-3.5" /> MENUNGGU KONFIRMASI
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
            <Check className="w-3.5 h-3.5" /> JADWAL DIKONFIRMASI
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-400/20 text-blue-300 border border-blue-400/30">
            <CheckCheck className="w-3.5 h-3.5" /> KUNJUNGAN SELESAI
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-400/20 text-rose-300 border border-rose-400/30">
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
        className="flex gap-2.5 mb-10 no-print"
      >
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Masukkan Kode Booking (cth: BK-202611-101)..."
            value={bookingCode}
            onChange={(e) => setBookingCode(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
            required
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl text-sm font-bold hover:from-indigo-500 hover:to-violet-500 transition shadow-md shadow-indigo-500/25 flex items-center gap-2 disabled:opacity-50 active:scale-98"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Lacak Tiket'}
        </button>
      </form>

      {/* ERROR MESSAGE */}
      {errorMsg && (
        <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3 mb-8 animate-fade-in no-print">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
          <div>
            <p className="font-bold">{errorMsg}</p>
            <p className="text-xs text-rose-600 mt-1">
              Pastikan Anda memasukkan kode dengan benar (contoh: <code className="font-mono font-bold">BK-202611-101</code>).
            </p>
          </div>
        </div>
      )}

      {/* BOOKING DETAILS TICKET */}
      {bookingData && (
        <div className="animate-fade-in">
          {/* DIGITAL TICKET */}
          <div className="print-area bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative mb-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-7 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/30 flex items-center justify-center text-indigo-300">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="font-extrabold tracking-tight text-white text-base">BookEase Studio Pass</span>
                </div>
                <div>{getStatusBadge(bookingData.status)}</div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Kode Tiket
                  </span>
                  <span className="text-2xl font-mono font-extrabold text-white tracking-wider">
                    {bookingData.bookingCode}
                  </span>
                </div>
                <button
                  onClick={() => copyBookingCode(bookingData.bookingCode)}
                  className="no-print text-xs text-indigo-200 hover:text-white flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
            </div>

            {/* Perforation line */}
            <div className="relative flex items-center justify-between px-4 py-1 bg-slate-50 border-y border-dashed border-slate-300">
              <div className="w-5 h-5 bg-slate-100 rounded-full -ml-6 border-r border-slate-300" />
              <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                • • • VERIFIED APPOINTMENT PASS • • •
              </span>
              <div className="w-5 h-5 bg-slate-100 rounded-full -mr-6 border-l border-slate-300" />
            </div>

            {/* Ticket Body */}
            <div className="p-7 space-y-4 text-sm bg-white">
              <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                <span className="text-slate-400">Layanan:</span>
                <span className="font-bold text-slate-900 text-right">{bookingData.service?.name}</span>
              </div>

              <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                <span className="text-slate-400">Tanggal Kunjungan:</span>
                <span className="font-semibold text-slate-900 text-right">
                  {new Date(bookingData.date).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}{' '}
                  <span className="text-indigo-600 block">
                    ({bookingData.startTime} - {bookingData.endTime} WIB)
                  </span>
                </span>
              </div>

              <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                <span className="text-slate-400">Nama Pemesan:</span>
                <span className="font-semibold text-slate-900 text-right">{bookingData.customerName}</span>
              </div>

              <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                <span className="text-slate-400">Kontak WhatsApp:</span>
                <span className="font-semibold text-slate-900 text-right">{bookingData.customerPhone}</span>
              </div>

              {bookingData.notes && (
                <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                  <span className="text-slate-400">Catatan Khusus:</span>
                  <span className="font-normal text-slate-600 italic text-right max-w-xs">"{bookingData.notes}"</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-slate-900">Total Biaya:</span>
                <span className="text-2xl font-extrabold text-indigo-600">
                  {formatRupiah(bookingData.totalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS (NO-PRINT) */}
          <div className="no-print flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => window.print()}
              className="flex-1 py-3.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-2xl transition flex items-center justify-center gap-2 text-sm shadow-xs"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Cetak Tiket</span>
            </button>

            <a
              href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                `Halo Admin BookEase, saya ingin menanyakan status reservasi dengan kode ${bookingData.bookingCode} atas nama ${bookingData.customerName}. Terima kasih!`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl transition flex items-center justify-center gap-2 text-sm shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Hubungi Admin WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}

export default function CheckStatusPage() {
  return (
    <div className="py-16 sm:py-20 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10 no-print">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/50 text-indigo-700 text-xs font-bold mb-3 shadow-xs">
          <Search className="w-3.5 h-3.5" />
          Pelacakan Tiket Mandiri
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Cek Status Reservasi Anda
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
          Pantau status konfirmasi antrean atau cetak ulang bukti reservasi kapan saja.
        </p>
      </div>

      <Suspense fallback={<div className="text-center py-10 text-slate-400">Memuat data...</div>}>
        <CheckStatusContent />
      </Suspense>
    </div>
  );
}
