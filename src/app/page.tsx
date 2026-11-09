import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatRupiah } from '@/lib/utils';
import {
  CalendarCheck,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  Check,
  Zap,
  Award,
  ChevronRight,
} from 'lucide-react';
import { Service } from '@prisma/client';

export default async function HomePage() {
  let services: Service[] = [];
  try {
    services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });
  } catch (error) {
    console.error('Database connection error in HomePage:', error);
  }

  return (
    <div className="flex flex-col min-h-screen selection:bg-indigo-500 selection:text-white">
      {/* HERO SECTION WITH AMBIENT GLOW */}
      <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32 bg-slate-950 text-white">
        {/* Glow Spheres */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-indigo-600/30 via-violet-600/20 to-pink-500/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/20 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-violet-500/20 blur-[120px] pointer-events-none rounded-full" />

        {/* Grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* BADGE */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-semibold text-indigo-300 mb-8 animate-fade-in shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sistem Reservasi Online Generasi Baru</span>
          </div>

          {/* MAIN HEADLINE */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.12]">
            Booking Jadwal Perawatan{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-pink-400">
              Lebih Cepat, Tanpa Antre
            </span>
          </h1>

          <p className="mt-7 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Pilih layanan studio & spa favorit Anda, pilih slot jam secara real-time, dan dapatkan konfirmasi instan dengan proteksi bentrok jadwal otomatis.
          </p>

          {/* CTA BUTTONS */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/book"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-bold text-base shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 group"
            >
              <CalendarCheck className="w-5 h-5 text-indigo-200" />
              <span>Reservasi Sekarang</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/check-status"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-base backdrop-blur-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <span>Lacak Status Tiket</span>
            </Link>
          </div>

          {/* TRUST BADGE BAR */}
          <div className="mt-16 pt-10 border-t border-white/10 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-400">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-amber-400 text-lg font-bold">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span>4.9 / 5.0</span>
              </div>
              <span className="text-xs text-slate-400 mt-1">Rating Kepuasan</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-white">100% Real-time</span>
              <span className="text-xs text-slate-400 mt-1">Slot Anti Bentrok</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-white">&lt; 1 Menit</span>
              <span className="text-xs text-slate-400 mt-1">Proses Reservasi</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Terverifikasi
              </span>
              <span className="text-xs text-slate-400 mt-1">Konfirmasi WhatsApp</span>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE CATALOG SECTION */}
      <section id="services" className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Menu Perawatan
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Layanan Eksklusif Kami
              </h2>
              <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-xl">
                Ditangani langsung oleh para stylist & terapis bersertifikat dengan produk perawatan premium.
              </p>
            </div>

            <Link
              href="/book"
              className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 group"
            >
              <span>Lihat Kalender Booking</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.length === 0 ? (
              <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-400">
                Layanan belum diisi. Jalankan database seeder (`npm run prisma:seed`).
              </div>
            ) : (
              services.map((service, index) => (
                <div
                  key={service.id}
                  className="group relative bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm hover:shadow-2xl hover:border-indigo-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Subtle hover gradient background */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div>
                    {/* Top Row: Icon & Duration */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 group-hover:bg-gradient-to-tr group-hover:from-indigo-600 group-hover:to-violet-600 group-hover:text-white text-indigo-600 flex items-center justify-center transition-all duration-300 shadow-sm">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {service.durationMinutes} Menit
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-2.5 leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>

                  {/* Bottom Row: Price & Booking Button */}
                  <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Investasi
                      </span>
                      <span className="text-xl font-extrabold text-slate-900">
                        {formatRupiah(service.price)}
                      </span>
                    </div>

                    <Link
                      href={`/book?service=${service.id}`}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-violet-600 text-white text-xs font-bold transition-all shadow-sm hover:shadow-indigo-500/20 flex items-center gap-1.5 group-hover:scale-105"
                    >
                      <span>Pilih</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* FEATURE SPOTLIGHTS */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Mengapa BookEase?</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Pengalaman Reservasi Paling Mulus
            </h3>
            <p className="text-slate-500 text-sm mt-3">
              Dirancang dengan teknologi serverless dan database relational untuk menjamin akurasi jadwal Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 transition-all hover:shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-6 shadow-md shadow-indigo-200">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Kalkulasi Slot Otomatis</h4>
              <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
                Slot waktu dihitung dinamis dari jam buka, durasi tiap layanan, dan jadwal yang sudah terisi.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 transition-all hover:shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-6 shadow-md shadow-emerald-200">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Proteksi Anti Double-Booking</h4>
              <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
                Validasi transaksi atomik pada PostgreSQL menjamin tidak ada dua pelanggan yang memesan jam yang sama.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 transition-all hover:shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center mb-6 shadow-md shadow-violet-200">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Notifikasi & Tiket Digital</h4>
              <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
                Dilengkapi kode booking unik, integrasi konfirmasi WhatsApp instan, dan tiket cetak mandiri.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/40 via-violet-900/40 to-slate-950 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Siap Menikmati Perawatan Terbaik?
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg max-w-xl mx-auto">
            Amankan jam favorit Anda sekarang sebelum slot hari ini penuh.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/book"
              className="px-8 py-4 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-bold text-base shadow-xl hover:scale-105 transition-all flex items-center gap-2"
            >
              <CalendarCheck className="w-5 h-5 text-indigo-600" />
              <span>Reservasi Jadwal Sekarang</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
