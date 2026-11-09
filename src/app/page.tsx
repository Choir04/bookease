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
} from 'lucide-react';
import { Service } from '@prisma/client';

export default async function HomePage() {
  // Ambil layanan aktif dari database
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
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/60 via-white to-neutral-50/30 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            Sistem Booking Online Modern & Bebas Antre
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-neutral-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
            Reservasi Jadwal Layanan Tanpa Ribet dengan{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              BookEase
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto">
            Pilih layanan favorit Anda, tentukan jam yang pas, dan dapatkan konfirmasi instan secara real-time.
            Didukung pencegahan bentrok jadwal otomatis.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/book"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <CalendarCheck className="w-5 h-5" />
              <span>Reservasi Sekarang</span>
            </Link>
            <Link
              href="/check-status"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white border border-neutral-300 text-neutral-700 font-semibold hover:bg-neutral-50 hover:border-neutral-400 transition-all flex items-center justify-center gap-2"
            >
              <span>Cek Status Booking</span>
              <ArrowRight className="w-4 h-4 text-neutral-400" />
            </Link>
          </div>

          {/* BADGES & HIGHLIGHTS */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-neutral-200/60 pt-8 text-neutral-700">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-neutral-900">100%</span>
              <span className="text-xs text-neutral-500 mt-1">Real-time Slots</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-neutral-900">Anti Bentrok</span>
              <span className="text-xs text-neutral-500 mt-1">Collision Detection</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-neutral-900">Serverless</span>
              <span className="text-xs text-neutral-500 mt-1">Deploy di Vercel</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-neutral-900">PostgreSQL</span>
              <span className="text-xs text-neutral-500 mt-1">Prisma ORM Cloud</span>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE CATALOG SECTION */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Pilihan Perawatan</h2>
            <h3 className="text-3xl font-bold text-neutral-900">Daftar Layanan & Paket Eksklusif</h3>
            <p className="text-neutral-500 text-sm mt-3">
              Temukan perawatan terbaik yang ditangani langsung oleh para terapis dan stylist profesional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.length === 0 ? (
              <div className="col-span-full text-center py-12 text-neutral-400">
                Layanan belum diisi. Jalankan database seeder (`npm run prisma:seed`).
              </div>
            ) : (
              services.map((service) => (
                <div
                  key={service.id}
                  className="rounded-2xl border border-neutral-200 p-6 flex flex-col justify-between hover:shadow-xl hover:border-indigo-200 transition-all duration-300 group bg-white"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white text-indigo-600 flex items-center justify-center transition-colors">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {service.durationMinutes} menit
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-neutral-900 group-hover:text-indigo-600 transition-colors">
                      {service.name}
                    </h4>
                    <p className="text-xs text-neutral-500 mt-2 leading-relaxed">{service.description}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-neutral-400 block">Biaya Perawatan</span>
                      <span className="text-lg font-bold text-neutral-900">{formatRupiah(service.price)}</span>
                    </div>
                    <Link
                      href={`/book?service=${service.id}`}
                      className="px-4 py-2 rounded-xl bg-neutral-900 group-hover:bg-indigo-600 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <span>Booking</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* KEY FEATURES SECTION */}
      <section className="py-20 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-neutral-900">Slot Dinamis & Akurat</h4>
              <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
                Slot waktu dihitung secara dinamis dari jam operasional dan otomatis mengunci jam yang telah dipesan orang
                lain.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-neutral-900">Panel Manajemen Admin</h4>
              <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
                Kelola status antrean pelanggan, konfirmasi atau batalkan reservasi, serta pantau analitik pendapatan
                harian.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center mb-6">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-neutral-900">Pelacakan Status Mandiri</h4>
              <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
                Pelanggan cukup memasukkan Kode Unik Booking untuk mengetahui status jadwal secara transparan kapan saja.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
