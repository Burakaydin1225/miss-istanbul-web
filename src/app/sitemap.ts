import type { MetadataRoute } from "next";

import prisma from "@/lib/prisma";
import {
  absoluteUrl,
  siteConfig,
} from "@/lib/site-config";

export const dynamic = "force-dynamic";

const staticPages = [
  {
    path: "/",
    changeFrequency: "daily",
    priority: 1,
  },
  {
    path: "/hakkimizda",
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    path: "/iletisim",
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    path: "/ilan-yayinlama-kurallari",
    changeFrequency: "monthly",
    priority: 0.4,
  },
  {
    path: "/gizlilik-politikasi",
    changeFrequency: "yearly",
    priority: 0.2,
  },
  {
    path: "/kullanim-kosullari",
    changeFrequency: "yearly",
    priority: 0.2,
  },
] as const;

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
        updatedAt: true,
      },

      orderBy: {
        updatedAt: "desc",
      },
    });

  const staticEntries: MetadataRoute.Sitemap =
    staticPages.map((page) => ({
      url: absoluteUrl(page.path),
      lastModified: now,
      changeFrequency:
        page.changeFrequency,
      priority: page.priority,
    }));

  const productEntries: MetadataRoute.Sitemap =
    products.map((product) => ({
      url: absoluteUrl(
        `/urun/${product.slug}`,
      ),
      lastModified: product.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  return [
    ...staticEntries,
    ...productEntries,
  ];
}
