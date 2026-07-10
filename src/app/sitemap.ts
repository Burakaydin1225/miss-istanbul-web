import type { MetadataRoute } from "next";

import prisma from "@/lib/prisma";
import {
  absoluteUrl,
  seoRegions,
} from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
      select: {
        slug: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/hakkimizda"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/iletisim"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl(
        "/ilan-yayinlama-kurallari",
      ),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: absoluteUrl(
        "/gizlilik-politikasi",
      ),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.25,
    },
    {
      url: absoluteUrl(
        "/kullanim-kosullari",
      ),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.25,
    },
  ];

  const regionRoutes =
    seoRegions.map((region) => ({
      url: absoluteUrl(
        `/bolge/${region.slug}`,
      ),
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.75,
    }));

  const productRoutes =
    products.map((product) => ({
      url: absoluteUrl(
        `/urun/${product.slug}`,
      ),
      lastModified: product.createdAt,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

  return [
    ...staticRoutes,
    ...regionRoutes,
    ...productRoutes,
  ];
}
