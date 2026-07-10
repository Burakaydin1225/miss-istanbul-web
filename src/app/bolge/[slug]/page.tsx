import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProductCategoryConfig } from "@/lib/product-categories";
import prisma from "@/lib/prisma";
import {
  absoluteUrl,
  getSeoRegionBySlug,
  seoRegions,
  serializeJsonLd,
  siteConfig,
} from "@/lib/site-config";

export const dynamic = "force-dynamic";

type RegionPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function normalizeText(value: string): string {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/\s+/g, " ")
    .trim();
}

function productMatchesRegion(
  product: {
    name: string;
    shortDescription: string | null;
    description: string;
    cardTag: string | null;
    region: string | null;
  },
  searchTerms: readonly string[],
): boolean {
  const searchableText = normalizeText(
    [
      product.name,
      product.shortDescription,
      product.description,
      product.cardTag,
    ]
      .filter(Boolean)
      .join(" "),
  );

  return searchTerms.some((term) =>
    searchableText.includes(
      normalizeText(term),
    ),
  );
}

export async function generateMetadata({
  params,
}: RegionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const region = getSeoRegionBySlug(slug);

  if (!region) {
    return {
      title: "Bölge bulunamadı",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const url = absoluteUrl(
    `/bolge/${region.slug}`,
  );

  return {
    title: region.title,
    description: region.description,
    alternates: {
      canonical: `/bolge/${region.slug}`,
    },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url,
      siteName: siteConfig.name,
      title: region.title,
      description: region.description,
    },
    twitter: {
      card: "summary",
      title: region.title,
      description: region.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RegionPage({
  params,
}: RegionPageProps) {
  const { slug } = await params;
  const region = getSeoRegionBySlug(slug);

  if (!region) {
    notFound();
  }

  const now = new Date();

  const products =
    await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          {
            subscriptionEndsAt: null,
          },
          {
            subscriptionEndsAt: {
              gt: now,
            },
          },
        ],
      },
      orderBy: [
        {
          category: "asc",
        },
        {
          sortOrder: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        description: true,
        coverImage: true,
        cardTag: true,
        region: true,
        category: true,
      },
    });

  const matchedProducts = products.filter(
    (product) =>
      product.region === region.slug ||
      productMatchesRegion(
        product,
        region.searchTerms,
      ),
  );

  const displayedProducts =
    matchedProducts.length > 0
      ? matchedProducts.slice(0, 60)
      : products.slice(0, 24);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Ana sayfa",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: region.name,
        item: absoluteUrl(
          `/bolge/${region.slug}`,
        ),
      },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: region.h1,
    description: region.description,
    url: absoluteUrl(
      `/bolge/${region.slug}`,
    ),
    inLanguage: "tr-TR",
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <div className="min-h-screen bg-[#f4f4f0]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            serializeJsonLd(
              breadcrumbJsonLd,
            ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            serializeJsonLd(
              collectionJsonLd,
            ),
        }}
      />

      <header className="border-b border-fuchsia-400/40 bg-black shadow-[0_0_26px_rgba(217,70,239,0.28)]">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link
            href="/"
            className="text-sm font-bold text-white/80 transition hover:text-white"
          >
            ← Ana sayfa
          </Link>

          <Link
            href="/"
            className="bg-[linear-gradient(90deg,#fff8d6_0%,#ffd36a_22%,#f59e0b_50%,#fff3b0_72%,#b45309_100%)] bg-clip-text text-lg font-black tracking-[0.12em] text-transparent drop-shadow-[0_0_12px_rgba(245,158,11,0.9)]"
          >
            {siteConfig.name}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-7 xl:max-w-[1500px]">
        <section className="rounded-[28px] border border-fuchsia-300/50 bg-white px-5 py-8 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-fuchsia-500">
            Bölge ilanları
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-[-0.05em] text-neutral-950 sm:text-5xl">
            {region.h1}
          </h1>

          <p className="mt-4 max-w-4xl text-sm leading-7 text-neutral-600 sm:text-base">
            {region.intro}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {seoRegions.map((item) => (
              <Link
                key={item.slug}
                href={`/bolge/${item.slug}`}
                className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                  item.slug === region.slug
                    ? "border-fuchsia-400 bg-fuchsia-100 text-fuchsia-700"
                    : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-950 hover:text-neutral-950"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-7">
          <div className="mb-4">
            <h2 className="text-xl font-black tracking-[-0.03em] text-neutral-950">
              Güncel ilanlar
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              {displayedProducts.length} ilan listeleniyor
            </p>
          </div>

          {displayedProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {displayedProducts.map((product) => {
                const category =
                  getProductCategoryConfig(
                    product.category,
                  );

                return (
                  <Link
                    key={product.id}
                    href={`/urun/${product.slug}`}
                    className="group overflow-hidden rounded-[20px] border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className="relative aspect-[4/3] bg-neutral-200">
                      <Image
                        src={product.coverImage}
                        alt={`${product.name} ilan görseli`}
                        fill
                        sizes="(max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />

                      <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-black text-white backdrop-blur">
                        {category.label}
                      </span>

                      {product.cardTag ? (
                        <span className="absolute right-2 top-2 max-w-[150px] truncate rounded-full bg-fuchsia-600 px-2.5 py-1 text-[10px] font-black text-white shadow-lg">
                          {product.cardTag}
                        </span>
                      ) : null}
                    </div>

                    <div className="p-4">
                      <h3 className="line-clamp-1 text-sm font-black text-neutral-950">
                        {product.name}
                      </h3>

                      {product.shortDescription ? (
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-neutral-500">
                          {product.shortDescription}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-white px-5 py-12 text-center">
              <p className="text-sm font-semibold text-neutral-700">
                Bu bölge için henüz yayınlanmış ilan bulunmuyor.
              </p>
            </div>
          )}
        </section>

        <section className="mt-10 rounded-[24px] border border-black/10 bg-white px-5 py-7 shadow-sm">
          <h2 className="text-xl font-black tracking-[-0.03em] text-neutral-950">
            {region.shortName} ilanlarını nasıl inceleyebilirsiniz?
          </h2>

          <div className="mt-4 grid gap-4 text-sm leading-7 text-neutral-600 md:grid-cols-3">
            <p>
              İlanları VIP, Premium ve Gold kategorilerine göre
              ayırarak daha kolay inceleyebilirsiniz.
            </p>

            <p>
              Detay sayfalarında fotoğraflar, açıklama,
              kategori bilgisi ve iletişim seçenekleri yer alır.
            </p>

            <p>
              Güncel ilanlar aktiflik ve abonelik durumuna göre
              listelenir; pasif ilanlar ziyaretçilere gösterilmez.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
