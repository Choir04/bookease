'use client';

import { useState, useEffect, useTransition } from 'react';
import { getAvailableSlots, createBooking, TimeSlot } from '@/actions/booking';
import { formatRupiah } from '@/lib/utils';
import { Calendar, Clock, User, Mail, Phone, FileText, CheckCircle2, AlertCircle, Loader2, Printer, MessageCircle } from 'lucide-react';
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

  // SUCCESS VIEW
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
      <div className="bg-white rounded-2xl shadow-xl border border-neutral-100 p-8 text-center max-w-xl mx-auto animate-fade-in">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900">Reservasi Berhasil Diajukan!</h2>
        <p className="text-sm text-neutral-600 mt-2">
          Terima kasih, reservasi Anda telah kami terima dan sedang dalam antrean konfirmasi admin.
        </p>

        <div className="bg-neutral-50 rounded-xl p-5 my-6 text-left border border-neutral-200">
          <div className="flex justify-between items-center border-b border-neutral-200 pb-3 mb-3">
            <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Kode Booking</span>
            <span className="text-base font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              {confirmedBooking.bookingCode}
            </span>
          </div>
          <div className="space-y-2 text-sm text-neutral-700">
            <div className="flex justify-between">
              <span className="text-neutral-500">Layanan:</span>
              <span className="font-medium text-neutral-900">{confirmedBooking.service?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Tanggal & Waktu:</span>
              <span className="font-medium text-neutral-900">
                {new Date(confirmedBooking.date).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                ({confirmedBooking.startTime} - {confirmedBooking.endTime})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Nama Pelanggan:</span>
              <span className="font-medium text-neutral-900">{confirmedBooking.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Status:</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800">
                PENDING (Menunggu Konfirmasi)
              </span>
            </div>
            <div className="flex justify-between border-t border-neutral-200 pt-2 mt-2">
              <span className="font-semibold text-neutral-900">Estimasi Total:</span>
              <span className="font-bold text-indigo-600">{formatRupiah(confirmedBooking.totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS: WHATSAPP & PRINT */}
        <div className="space-y-3">
          <a
            href={`https://wa.me/6281234567890?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition shadow-md hover:shadow-emerald-200 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Konfirmasi ke Admin via WhatsApp</span>
          </a>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium rounded-xl transition flex items-center justify-center gap-2 text-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Tiket</span>
            </button>
            <Link
              href={`/check-status?code=${confirmedBooking.bookingCode}`}
              className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-xl transition text-sm flex items-center justify-center"
            >
              Lihat Status di Sistem
            </Link>
            <button
              onClick={() => {
                setConfirmedBooking(null);
                setSelectedTime('');
                setNotes('');
              }}
              className="px-4 py-2.5 text-neutral-500 hover:text-neutral-800 text-sm font-medium transition"
            >
              + Buat Baru
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-6 sm:p-8">
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: PILIH LAYANAN */}
      <div className="mb-8">
        <label className="block text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">
            1
          </span>
          Pilih Layanan
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {services.map((service) => {
            const isSelected = selectedServiceId === service.id;
            return (
              <div
                key={service.id}
                onClick={() => setSelectedServiceId(service.id)}
                className={`cursor-pointer rounded-xl p-4 border text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-neutral-900 text-sm">{service.name}</h4>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-100/70 px-2 py-0.5 rounded">
                    {formatRupiah(service.price)}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 line-clamp-2 mb-2">{service.description}</p>
                <div className="flex items-center gap-1 text-[11px] text-neutral-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Durasi: {service.durationMinutes} menit</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 2: PILIH TANGGAL & JAM */}
      <div className="mb-8">
        <label className="block text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">
            2
          </span>
          Pilih Tanggal & Waktu
        </label>
        <div className="mb-4">
          <div className="relative">
            <input
              type="date"
              min={todayStr}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-neutral-800"
              required
            />
            <Calendar className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
          </div>
        </div>

        <div>
          <span className="text-xs font-medium text-neutral-600 mb-2 block">Slot Waktu Tersedia:</span>
          {isLoadingSlots ? (
            <div className="flex items-center justify-center py-6 gap-2 text-neutral-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span>Memeriksa ketersediaan jadwal...</span>
            </div>
          ) : slots.length === 0 ? (
            <p className="text-xs text-neutral-500 italic py-2">Tidak ada slot operasional pada tanggal ini.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {slots.map((slot) => {
                const isSelected = selectedTime === slot.time;
                return (
                  <button
                    type="button"
                    key={slot.time}
                    disabled={!slot.isAvailable}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all border ${
                      !slot.isAvailable
                        ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed opacity-60 line-through'
                        : isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-indigo-300 hover:bg-neutral-50'
                    }`}
                    title={slot.reason || 'Tersedia'}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* STEP 3: INFORMASI PELANGGAN */}
      <div className="mb-8">
        <label className="block text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">
            3
          </span>
          Data Pemesan
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Nama Lengkap *</label>
            <div className="relative">
              <input
                type="text"
                placeholder="cth: Siti Rahmawati"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <User className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Email *</label>
            <div className="relative">
              <input
                type="email"
                placeholder="cth: siti@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Nomor WhatsApp *</label>
            <div className="relative">
              <input
                type="tel"
                placeholder="cth: 081234567890"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Catatan Tambahan (Opsional)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="cth: Kulit sensitif / riwayat perawatan"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <FileText className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY & SUBMIT */}
      <div className="border-t border-neutral-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs text-neutral-500 block">Total Biaya:</span>
          <span className="text-xl font-bold text-indigo-600">
            {selectedService ? formatRupiah(selectedService.price) : 'Rp 0'}
          </span>
        </div>

        <button
          type="submit"
          disabled={isPending || !selectedTime}
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-indigo-200 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memproses...</span>
            </>
          ) : (
            <span>Konfirmasi Reservasi</span>
          )}
        </button>
      </div>
    </form>
  );
}
