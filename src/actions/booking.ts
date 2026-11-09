'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { generateBookingCode } from '@/lib/utils';
import { BookingStatus } from '@prisma/client';

export interface TimeSlot {
  time: string;
  isAvailable: boolean;
  reason?: string;
}

/**
 * Mendapatkan slot waktu yang tersedia pada tanggal tertentu untuk layanan tertentu.
 * Logika ini mendeteksi konflik jadwal agar tidak terjadi double-booking.
 */
export async function getAvailableSlots(dateStr: string, serviceId: string): Promise<TimeSlot[]> {
  try {
    const selectedDate = new Date(dateStr);
    selectedDate.setHours(0, 0, 0, 0);

    const [settings, service, existingBookings] = await Promise.all([
      prisma.businessSetting.findUnique({ where: { id: 'default' } }),
      prisma.service.findUnique({ where: { id: serviceId } }),
      prisma.booking.findMany({
        where: {
          date: selectedDate,
          status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        },
        select: { startTime: true, endTime: true },
      }),
    ]);

    const openHour = settings ? parseInt(settings.openTime.split(':')[0]) : 9;
    const closeHour = settings ? parseInt(settings.closeTime.split(':')[0]) : 18;
    const slotDuration = settings?.slotDurationMin || 60;

    const slots: TimeSlot[] = [];
    const bookedTimes = new Set(existingBookings.map((b) => b.startTime));

    for (let hour = openHour; hour < closeHour; hour += slotDuration / 60) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      const isBooked = bookedTimes.has(timeString);

      // Cek jika tanggal hari ini dan jam sudah lewat
      const now = new Date();
      const isToday = selectedDate.toDateString() === now.toDateString();
      const isPast = isToday && hour <= now.getHours();

      slots.push({
        time: timeString,
        isAvailable: !isBooked && !isPast,
        reason: isBooked ? 'Sudah Dipesan' : isPast ? 'Waktu Telah Lewat' : undefined,
      });
    }

    return slots;
  } catch (error) {
    console.error('Error fetching available slots:', error);
    return [];
  }
}

/**
 * Membuat Booking baru dengan validasi bentrok jadwal.
 */
export async function createBooking(data: {
  serviceId: string;
  dateStr: string;
  startTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
}) {
  try {
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
    });

    if (!service) {
      return { success: false, error: 'Layanan tidak ditemukan' };
    }

    const bookingDate = new Date(data.dateStr);
    bookingDate.setHours(0, 0, 0, 0);

    // Hitung endTime berdasarkan durationMinutes
    const [startHour, startMin] = data.startTime.split(':').map(Number);
    const endMinutesTotal = startHour * 60 + startMin + service.durationMinutes;
    const endHour = Math.floor(endMinutesTotal / 60);
    const endMin = endMinutesTotal % 60;
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;

    // Cek kembali ketersediaan slot (Atomic Conflict Prevention)
    const conflict = await prisma.booking.findFirst({
      where: {
        date: bookingDate,
        startTime: data.startTime,
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
      },
    });

    if (conflict) {
      return {
        success: false,
        error: 'Maaf, slot waktu tersebut baru saja dipesan oleh pelanggan lain. Silakan pilih jam lain.',
      };
    }

    // Buat booking dengan kode unik
    const bookingCode = generateBookingCode();

    const newBooking = await prisma.booking.create({
      data: {
        bookingCode,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        serviceId: service.id,
        date: bookingDate,
        startTime: data.startTime,
        endTime,
        totalPrice: service.price,
        status: BookingStatus.PENDING,
        notes: data.notes || null,
      },
      include: {
        service: true,
      },
    });

    revalidatePath('/admin');
    return { success: true, booking: newBooking };
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return { success: false, error: error.message || 'Gagal membuat reservasi' };
  }
}

/**
 * Mengubah status booking (Admin Action)
 */
export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  try {
    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    revalidatePath('/admin');
    return { success: true, booking: updated };
  } catch (error: any) {
    console.error('Error updating status:', error);
    return { success: false, error: error.message || 'Gagal mengubah status' };
  }
}

/**
 * Mencari booking berdasarkan kode unik atau email
 */
export async function findBookingByCode(bookingCode: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { bookingCode: bookingCode.trim().toUpperCase() },
      include: { service: true },
    });

    if (!booking) {
      return { success: false, error: 'Reservasi dengan kode tersebut tidak ditemukan.' };
    }

    return { success: true, booking };
  } catch (error: any) {
    return { success: false, error: 'Terjadi kesalahan sistem saat mencari data.' };
  }
}

