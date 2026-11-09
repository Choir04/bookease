'use client';

import { useState, useEffect, useTransition } from 'react';
import { getAvailableSlots, createBooking, TimeSlot } from '@/actions/booking';
import { formatRupiah } from '@/lib/utils';
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Printer,
  MessageCircle,
  Sparkles,
  Check,
  Copy,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
}

export default function BookingForm({
  services,
  initialServiceId,
}: {
  services: ServiceItem[];
  initialServiceId?: string;
}) {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServiceId || (services[0]?.id ?? '')
  );

  // Default to today in YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);

  // Customer input states
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Status & Success state
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Quick date shortcuts (Today, Tomorrow, Day After Tomorrow)
  const getQuickDates = () => {
    const dates = [];
    const daysLabel = ['Hari Ini', 'Besok', 'Lusa'];
    for (let i = 0; i < 3; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const str = d.toISOString().split('T')[0];
      dates.push({ label: daysLabel[i], value: str, dateObj: d });
    }
    return dates;
  };
  const quickDates = getQuickDates();

  // Fetch slots whenever service or date changes
  useEffect(() => {
    if (!selectedServiceId || !selectedDate) return;

    let isMounted = true;
    setIsLoadingSlots(true);
    setSelectedTime('');

    getAvailableSlots(selectedDate, selectedServiceId)
      .then((data) => {
        if (isMounted) {
          setSlots(data);
          setIsLoadingSlots(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoadingSlots(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDate, selectedServiceId]);

  const selectedService = services.find((s) => s.id === selectedServiceId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedServiceId || !selectedDate || !selectedTime) {
      setErrorMessage('Mohon lengkapi pilihan layanan, tanggal, dan jam reservasi.');
      return;
    }

    if (!customerName || !customerEmail || !customerPhone) {
      setErrorMessage('Mohon isi nama, email, dan nomor WhatsApp Anda.');
      return;
    }

    startTransition(async () => {
      const res = await createBooking({
        serviceId: selectedServiceId,
        dateStr: selectedDate,
        startTime: selectedTime,
        customerName,
        customerEmail,
        customerPhone,
        notes,
      });

      if (res.success && res.booking) {
        setConfirmedBooking(res.booking);
      } else {
        setErrorMessage(res.error || 'Terjadi kesalahan saat memproses booking.');
      }
    });
  };

  const copyBookingCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // SUCCESS / DIGITAL TICKET VIEW
  if (confirmedBooking) {
    const waMessage = encodeURIComponent(
      `Halo Admin BookEase, saya telah membuat reservasi:\n\n` +
      `*Kode Booking:* ${confirmedBooking.bookingCode}\n` +
      `*Nama:* ${confirmedBooking.customerName}\n` +
      `*Layanan:* ${confirmedBooking.service?.name}\n` +
      `*Waktu:* ${confirmedBooking.startTime} - ${confirmedBooking.endTime} WIB\n\n` +
      `Mohon informasinya jika jadwal sudah terkonfirmasi. Terima kasih!`
    );

    return (
      <div className="max-w-xl mx-auto animate-fade-in">
        {/* SUCCESS BADGE */}
        <div className="text-center mb-6 no-print">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Reservasi Berhasil Diajukan!</h2>
          <p className="text-sm text-slate-500 mt-1">
            Simpan tiket digital Anda atau kirim konfirmasi langsung ke WhatsApp Admin.
          </p>
        </div>

        {/* DIGITAL TICKET CARD (PRINTABLE) */}
        <div className="print-area bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative mb-6">
          {/* Top Notch Decoration */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 sm:p-7 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/30 flex items-center justify-center text-indigo-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-extrabold tracking-tight text-white text-base">BookEase Pass</span>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <Clock className="w-3 h-3" /> PENDING CONFIRMATION
              </span>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Kode Unik Booking
                </span>
                <span className="text-2xl font-mono font-extrabold text-white tracking-wider">
                  {confirmedBooking.bookingCode}
                </span>
              </div>
              <button
                onClick={() => copyBookingCode(confirmedBooking.bookingCode)}
                className="no-print text-xs text-indigo-200 hover:text-white flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Tersalin!' : 'Salin Kode'}</span>
              </button>
            </div>
          </div>

          {/* Ticket Perforation effect */}
          <div className="relative flex items-center justify-between px-4 py-1 bg-slate-50 border-y border-dashed border-slate-300">
            <div className="w-5 h-5 bg-slate-100 rounded-full -ml-6 border-r border-slate-300" />
            <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
              • • • APPOINTMENT TICKET • • •
            </span>
            <div className="w-5 h-5 bg-slate-100 rounded-full -mr-6 border-l border-slate-300" />
          </div>

          {/* Ticket Body */}
          <div className="p-6 sm:p-7 space-y-4 text-sm text-slate-700 bg-white">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <span className="text-slate-400">Layanan:</span>
              <span className="font-bold text-slate-900 text-right">{confirmedBooking.service?.name}</span>
            </div>

            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <span className="text-slate-400">Jadwal Kunjungan:</span>
              <span className="font-semibold text-slate-900 text-right">
                {new Date(confirmedBooking.date).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                <span className="text-indigo-600 block">
                  ({confirmedBooking.startTime} - {confirmedBooking.endTime} WIB)
                </span>
              </span>
            </div>

            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <span className="text-slate-400">Nama Pelanggan:</span>
              <span className="font-semibold text-slate-900 text-right">{confirmedBooking.customerName}</span>
            </div>

            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <span className="text-slate-400">WhatsApp:</span>
              <span className="font-semibold text-slate-900 text-right">{confirmedBooking.customerPhone}</span>
            </div>

            {confirmedBooking.notes && (
              <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                <span className="text-slate-400">Catatan:</span>
                <span className="font-normal text-slate-600 italic text-right max-w-xs">"{confirmedBooking.notes}"</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <span className="font-bold text-slate-900">Total Biaya:</span>
              <span className="text-2xl font-extrabold text-indigo-600">
                {formatRupiah(confirmedBooking.totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS (NO-PRINT) */}
        <div className="no-print space-y-3">
          <a
            href={`https://wa.me/6281234567890?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl transition shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 flex items-center justify-center gap-2.5 active:scale-98"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Kirim Bukti Reservasi ke WhatsApp Admin</span>
          </a>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => window.print()}
              className="flex-1 py-3.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-2xl transition flex items-center justify-center gap-2 text-sm shadow-xs"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Cetak Tiket</span>
            </button>

            <Link
              href={`/check-status?code=${confirmedBooking.bookingCode}`}
              className="flex-1 py-3.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-2xl transition flex items-center justify-center text-sm"
            >
              Cek Status di Sistem
            </Link>

            <button
              onClick={() => {
                setConfirmedBooking(null);
                setSelectedTime('');
                setNotes('');
              }}
              className="py-3.5 px-4 text-slate-400 hover:text-slate-700 text-sm font-semibold transition"
            >
              + Reservasi Baru
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-6 sm:p-10"
    >
      {errorMessage && (
        <div className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: PILIH LAYANAN */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white text-xs font-extrabold flex items-center justify-center shadow-md shadow-indigo-200">
            1
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Pilih Paket Layanan</h3>
            <p className="text-xs text-slate-400">Pilih salah satu perawatan yang Anda inginkan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map((service) => {
            const isSelected = selectedServiceId === service.id;
            return (
              <div
                key={service.id}
                onClick={() => setSelectedServiceId(service.id)}
                className={`relative cursor-pointer rounded-2xl p-5 border text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/25 shadow-md shadow-indigo-500/5'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                }`}
              >
                {/* Active Checkmark Pill */}
                {isSelected && (
                  <span className="absolute top-4 right-4 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}

                <div className="pr-8">
                  <h4 className="font-bold text-slate-900 text-sm">{service.name}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 mb-3">{service.description}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-xs font-extrabold text-indigo-600">
                    {formatRupiah(service.price)}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {service.durationMinutes} menit
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 2: PILIH TANGGAL & WAKTU */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white text-xs font-extrabold flex items-center justify-center shadow-md shadow-indigo-200">
            2
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Tentukan Tanggal & Jam</h3>
            <p className="text-xs text-slate-400">Pilih hari kunjungan dan slot waktu yang tersedia</p>
          </div>
        </div>

        {/* Quick Date Shortcuts + Date Picker */}
        <div className="space-y-3 mb-6">
          <div className="grid grid-cols-3 gap-2">
            {quickDates.map((q) => {
              const isSelected = selectedDate === q.value;
              return (
                <button
                  type="button"
                  key={q.value}
                  onClick={() => setSelectedDate(q.value)}
                  className={`py-3 px-3 rounded-2xl border text-center transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700 font-semibold'
                  }`}
                >
                  <span className="text-xs block opacity-90">{q.label}</span>
                  <span className="text-sm font-extrabold">
                    {q.dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative">
            <input
              type="date"
              min={todayStr}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-slate-800 bg-slate-50/50"
              required
            />
            <Calendar className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          </div>
        </div>

        {/* Available Time Slots */}
        <div>
          <span className="text-xs font-bold text-slate-600 mb-2.5 block">Pilih Jam Kedatangan:</span>
          {isLoadingSlots ? (
            <div className="flex items-center justify-center py-8 gap-2 text-slate-400 text-sm bg-slate-50 rounded-2xl border border-slate-200">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span>Memeriksa ketersediaan jadwal di database...</span>
            </div>
          ) : slots.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4 text-center bg-slate-50 rounded-2xl">
              Tidak ada slot operasional pada tanggal ini.
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
              {slots.map((slot) => {
                const isSelected = selectedTime === slot.time;
                return (
                  <button
                    type="button"
                    key={slot.time}
                    disabled={!slot.isAvailable}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                      !slot.isAvailable
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50 line-through'
                        : isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/25 scale-105'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50'
                    }`}
                    title={slot.reason || 'Tersedia'}
                  >
                    {slot.isAvailable && (
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500'}`} />
                    )}
                    <span>{slot.time}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* STEP 3: INFORMASI PELANGGAN */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white text-xs font-extrabold flex items-center justify-center shadow-md shadow-indigo-200">
            3
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Rincian Kontak Anda</h3>
            <p className="text-xs text-slate-400">Untuk pengiriman konfirmasi dan tiket digital</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Lengkap *</label>
            <div className="relative">
              <input
                type="text"
                placeholder="cth: Siti Rahmawati"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                required
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Aktif *</label>
            <div className="relative">
              <input
                type="email"
                placeholder="cth: siti@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                required
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Nomor WhatsApp *</label>
            <div className="relative">
              <input
                type="tel"
                placeholder="cth: 081234567890"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                required
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Catatan Khusus (Opsional)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="cth: Kulit sensitif / permintaan terapis"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
              />
              <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER SUMMARY & SUBMIT BUTTON */}
      <div className="border-t border-slate-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
            Total Pembayaran
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600">
            {selectedService ? formatRupiah(selectedService.price) : 'Rp 0'}
          </span>
          <span className="text-[11px] text-slate-400 block">Bayar langsung di kasir studio</span>
        </div>

        <button
          type="submit"
          disabled={isPending || !selectedTime}
          className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 flex items-center justify-center gap-2 group active:scale-98"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Memproses Reservasi...</span>
            </>
          ) : (
            <>
              <span>Konfirmasi & Amankan Jadwal</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
