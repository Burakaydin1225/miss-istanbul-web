import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const LEGACY_R2_URL = "https://media.beylikduzu24.com";
const CANONICAL_R2_URL = "https://media.beylikduzu25.com";
const apply = process.argv.includes("--apply");
const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DIRECT_URL veya DATABASE_URL ortam değişkeni bulunamadı.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const [products, productImages] = await Promise.all([
    prisma.product.count({
      where: { coverImage: { startsWith: LEGACY_R2_URL } },
    }),
    prisma.productImage.count({
      where: { imageUrl: { startsWith: LEGACY_R2_URL } },
    }),
  ]);

  console.log(`Product.coverImage: ${products} kayıt`);
  console.log(`ProductImage.imageUrl: ${productImages} kayıt`);

  if (!apply) {
    console.log("DRY-RUN: Değişiklik yapılmadı. Uygulamak için --apply kullanın.");
    return;
  }

  const [updatedProducts, updatedProductImages] = await prisma.$transaction([
    prisma.$executeRaw`
      UPDATE "Product"
      SET "coverImage" = ${CANONICAL_R2_URL} || substring("coverImage" from ${LEGACY_R2_URL.length + 1})
      WHERE "coverImage" = ${LEGACY_R2_URL}
         OR "coverImage" LIKE ${`${LEGACY_R2_URL}/%`}
    `,
    prisma.$executeRaw`
      UPDATE "ProductImage"
      SET "imageUrl" = ${CANONICAL_R2_URL} || substring("imageUrl" from ${LEGACY_R2_URL.length + 1})
      WHERE "imageUrl" = ${LEGACY_R2_URL}
         OR "imageUrl" LIKE ${`${LEGACY_R2_URL}/%`}
    `,
  ]);

  console.log(`Güncellenen Product kaydı: ${updatedProducts}`);
  console.log(`Güncellenen ProductImage kaydı: ${updatedProductImages}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
