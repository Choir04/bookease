import { PrismaClient, BookingStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Seed Business Settings
  await prisma.businessSetting.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      businessName: 'BookEase Hair & Beauty Studio',
      contactEmail: 'contact@bookease-studio.test',
      contactPhone: '+62 812-3456-7890',
      address: 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan',
      openTime: '09:00',
      closeTime: '18:00',
      slotDurationMin: 60,
    },
  });

  // 2. Seed Services
  const servicesData = [
    {
      name: 'Haircut & Styling Deluxe',
      slug: 'haircut-styling-deluxe',
      description: 'Potong rambut profesional, cuci rambut aromaterapi, dan styling rambut sesuai bentuk wajah.',
      price: 150000,
      durationMinutes: 60,
      icon: 'Scissors',
      isActive: true,
    },
    {
      name: 'Scalp & Hair Spa Treatment',
      slug: 'scalp-hair-spa-treatment',
      description: 'Perawatan mendalam untuk kulit kepala sehat, pijat relaksasi bahu, dan serum anti-rontok.',
      price: 250000,
      durationMinutes: 75,
      icon: 'Sparkles',
      isActive: true,
    },
    {
      name: 'Balayage & Hair Coloring',
      slug: 'balayage-hair-coloring',
      description: 'Pewarnaan rambut tren modern dengan teknik Balayage halus dan toner premium bebas amonia.',
      price: 550000,
      durationMinutes: 120,
      icon: 'Palette',
      isActive: true,
    },
    {
      name: 'Deep Cleansing Glow Facial',
      slug: 'deep-cleansing-glow-facial',
      description: 'Pembersihan pori mendalam, ekstraksi komedo tanpa rasa sakit, dan masker collagen murni.',
      price: 220000,
      durationMinutes: 60,
      icon: 'Smile',
      isActive: true,
    },
    {
      name: 'Russian Manicure & Gel Polish',
      slug: 'russian-manicure-gel-polish',
      description: 'Perawatan kutikula detail khas Russian technique dan finishing gel polish tahan hingga 4 minggu.',
      price: 180000,
      durationMinutes: 60,
      icon: 'Hand',
      isActive: true,
    },
  ];

  for (const s of servicesData) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }

  // 3. Seed Sample Bookings
  const haircut = await prisma.service.findUnique({ where: { slug: 'haircut-styling-deluxe' } });
  const facial = await prisma.service.findUnique({ where: { slug: 'deep-cleansing-glow-facial' } });

  if (haircut && facial) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    await prisma.booking.upsert({
      where: { bookingCode: 'BK-202611-101' },
      update: {},
      create: {
        bookingCode: 'BK-202611-101',
        customerName: 'Budi Santoso',
        customerEmail: 'budi.santoso@example.com',
        customerPhone: '+6281298765432',
        serviceId: haircut.id,
        date: today,
        startTime: '10:00',
        endTime: '11:00',
        totalPrice: haircut.price,
        status: BookingStatus.CONFIRMED,
        notes: 'Minta dipotong undercut rapi.',
      },
    });

    await prisma.booking.upsert({
      where: { bookingCode: 'BK-202611-102' },
      update: {},
      create: {
        bookingCode: 'BK-202611-102',
        customerName: 'Siti Rahma',
        customerEmail: 'siti.rahma@example.com',
        customerPhone: '+6281311223344',
        serviceId: facial.id,
        date: today,
        startTime: '13:00',
        endTime: '14:00',
        totalPrice: facial.price,
        status: BookingStatus.PENDING,
        notes: 'Kulit sensitif, gunakan produk organik.',
      },
    });

    await prisma.booking.upsert({
      where: { bookingCode: 'BK-202611-103' },
      update: {},
      create: {
        bookingCode: 'BK-202611-103',
        customerName: 'Andi Pratama',
        customerEmail: 'andi.pratama@example.com',
        customerPhone: '+6285678901234',
        serviceId: haircut.id,
        date: tomorrow,
        startTime: '11:00',
        endTime: '12:00',
        totalPrice: haircut.price,
        status: BookingStatus.CONFIRMED,
      },
    });
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

