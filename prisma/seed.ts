import "dotenv/config";

import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  UserRole,
} from "../src/generated/prisma/client";

function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} ortam değişkeni bulunamadı.`);
  }

  return value;
}

const connectionString = getRequiredEnv("DATABASE_URL");
const adminName = getRequiredEnv("ADMIN_NAME");
const adminEmail = getRequiredEnv("ADMIN_EMAIL").toLowerCase();
const adminPassword = getRequiredEnv("ADMIN_PASSWORD");

if (adminPassword.length < 10) {
  throw new Error("Admin şifresi en az 10 karakter olmalıdır.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const demoProducts = [
  {
    name: "Modern Oturma Grubu",
    slug: "modern-oturma-grubu",
    shortDescription:
      "Modern çizgiler, yüksek konfor ve zamansız bir tasarım.",
    description:
      "Modern yaşam alanları için tasarlanan bu oturma grubu, rahatlık ve estetiği bir araya getirir. Dayanıklı kumaş yüzeyi, geniş oturum alanı ve sade tasarımı sayesinde farklı dekorasyon stilleriyle kolayca uyum sağlar.",
    coverImage:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=85",
    images: [
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1400&q=85",
    ],
  },
  {
    name: "Ahşap Yemek Masası",
    slug: "ahsap-yemek-masasi",
    shortDescription:
      "Doğal ahşap dokusu ve güçlü yapısıyla uzun ömürlü kullanım.",
    description:
      "Doğal ahşap yüzeyiyle sıcak ve zarif bir görünüm sunan yemek masası, günlük kullanıma uygun sağlam bir yapıya sahiptir. Geniş yüzeyi sayesinde aile yemekleri ve misafir ağırlamak için ideal bir kullanım alanı sunar.",
    coverImage:
      "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1400&q=85",
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1400&q=85",
    ],
  },
  {
    name: "Minimal Berjer",
    slug: "minimal-berjer",
    shortDescription:
      "Kompakt alanlar için şık, rahat ve kullanışlı bir koltuk.",
    description:
      "Minimal tasarım anlayışıyla hazırlanan berjer, hem salonlarda hem de çalışma alanlarında kullanılabilir. Ergonomik sırt yapısı, yumuşak oturum alanı ve dayanıklı ayaklarıyla konforlu bir kullanım sağlar.",
    coverImage:
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1400&q=85",
    images: [
      "https://images.unsplash.com/photo-1598300056393-4aac492f4344?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=85",
    ],
  },
  {
    name: "Yönetici Ofis Takımı",
    slug: "yonetici-ofis-takimi",
    shortDescription:
      "Profesyonel çalışma alanları için modern ve güçlü tasarım.",
    description:
      "Yönetici ofisleri için hazırlanan bu takım; geniş çalışma masası, depolama alanları ve bütünlük sağlayan modern tasarımıyla profesyonel bir ortam oluşturur. Yoğun günlük kullanıma uygun malzemelerle üretilmiştir.",
    coverImage:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=85",
    images: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85",
    ],
  },
];

async function main() {
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: {
      email: adminEmail,
    },
    update: {
      name: adminName,
      passwordHash,
      role: UserRole.ADMIN,
      isActive: true,
    },
    create: {
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  await prisma.siteSettings.upsert({
    where: {
      id: "default",
    },
    update: {},
    create: {
      id: "default",
      companyName: "Firma Kataloğu",
      headline: "Ürünlerimiz",
      description:
        "Detaylarını incelemek istediğiniz ürüne dokunun.",
      whatsappNumber: "905555555555",
      whatsappMessage:
        "Merhaba, ürün hakkında bilgi almak istiyorum.",
    },
  });

  for (const [index, product] of demoProducts.entries()) {
    await prisma.product.upsert({
      where: {
        slug: product.slug,
      },
      update: {},
      create: {
        name: product.name,
        slug: product.slug,
        shortDescription: product.shortDescription,
        description: product.description,
        coverImage: product.coverImage,
        sortOrder: index + 1,
        isActive: true,
        images: {
          create: product.images.map((imageUrl, imageIndex) => ({
            imageUrl,
            altText: `${product.name} görseli`,
            sortOrder: imageIndex + 1,
          })),
        },
      },
    });
  }

  console.log(`Admin hazır: ${admin.email}`);
  console.log(`${demoProducts.length} demo ürün kontrol edildi.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });