import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateBookingCode(): string {
  const dateStr = new Date().toISOString().slice(2, 7).replace('-', '');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `BK-${dateStr}-${randomNum}`;
}

