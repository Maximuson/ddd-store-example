import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import * as bcrypt from 'bcryptjs';
import { PrismaClient } from './generated/prisma/client';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? 'file:./prisma/dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      password,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@demo.com' },
    update: {},
    create: {
      email: 'user@demo.com',
      password,
      name: 'Regular User',
      role: 'USER',
    },
  });

  await prisma.user.upsert({
    where: { email: 'jane@demo.com' },
    update: {},
    create: {
      email: 'jane@demo.com',
      password,
      name: 'Jane Doe',
      role: 'USER',
    },
  });

  await prisma.session.deleteMany({});
  await prisma.product.deleteMany({});

  await prisma.session.createMany({
    data: [
      {
        userId: user.id,
        deviceType: 'WEB',
        userAgent: 'Mozilla/5.0 Chrome/120 MacOS',
        lastActivityAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      {
        userId: user.id,
        deviceType: 'MOBILE',
        userAgent: 'Expo/51.0',
        lastActivityAt: new Date(),
        expiresAt: null,
      },
      {
        userId: admin.id,
        deviceType: 'WEB',
        userAgent: 'Mozilla/5.0 Chrome/120 Windows',
        lastActivityAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    ],
  });

  const products = [
    { title: 'Wireless Headphones', description: 'Premium noise-cancelling wireless headphones.', price: 199.99, image: 'https://picsum.photos/seed/headphones/400/300', category: 'Electronics' },
    { title: 'Mechanical Keyboard', description: 'RGB mechanical keyboard with Cherry MX switches.', price: 149.99, image: 'https://picsum.photos/seed/keyboard/400/300', category: 'Electronics' },
    { title: 'Running Shoes', description: 'Lightweight running shoes with responsive cushioning.', price: 129.99, image: 'https://picsum.photos/seed/shoes/400/300', category: 'Sports' },
    { title: 'Coffee Maker', description: 'Programmable drip coffee maker with thermal carafe.', price: 79.99, image: 'https://picsum.photos/seed/coffee/400/300', category: 'Home' },
    { title: 'Yoga Mat', description: 'Non-slip eco-friendly yoga mat, 6mm thick.', price: 39.99, image: 'https://picsum.photos/seed/yoga/400/300', category: 'Sports' },
    { title: 'Desk Lamp', description: 'LED desk lamp with adjustable brightness.', price: 49.99, image: 'https://picsum.photos/seed/lamp/400/300', category: 'Home' },
    { title: 'Backpack', description: 'Water-resistant laptop backpack.', price: 59.99, image: 'https://picsum.photos/seed/backpack/400/300', category: 'Accessories' },
    { title: 'Smart Watch', description: 'Fitness tracker with heart rate monitor.', price: 249.99, image: 'https://picsum.photos/seed/watch/400/300', category: 'Electronics' },
    { title: 'Plant Pot Set', description: 'Ceramic plant pot set of 3.', price: 34.99, image: 'https://picsum.photos/seed/plants/400/300', category: 'Home' },
    { title: 'Water Bottle', description: 'Insulated stainless steel water bottle.', price: 24.99, image: 'https://picsum.photos/seed/bottle/400/300', category: 'Sports' },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log('Seed completed');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
