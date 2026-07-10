import { productRegions } from "./product-regions";

function normalizeSiteUrl(value: string): string {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "http://localhost:3000";
  }

  const withProtocol =
    trimmedValue.startsWith("http://") ||
    trimmedValue.startsWith("https://")
      ? trimmedValue
      : `https://${trimmedValue}`;

  return withProtocol.replace(/\/+$/, "");
}

const resolvedSiteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    "http://localhost:3000",
);

export const siteConfig = {
  name:
    process.env.NEXT_PUBLIC_SITE_NAME?.trim() ||
    "Miss İstanbul",

  shortName:
    process.env.NEXT_PUBLIC_SITE_SHORT_NAME?.trim() ||
    "Miss İstanbul",

  url: resolvedSiteUrl,

  homeTitle:
    "Beylikdüzü Escort İlanları | Güncel VIP Premium Gold",

  description:
    "Beylikdüzü escort ilanlarını VIP, Premium ve Gold kategorilerinde inceleyin. Avcılar, Esenyurt ve Büyükçekmece çevresindeki güncel ilanlara ulaşın.",

  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
    "",

  contactWhatsapp:
    process.env.NEXT_PUBLIC_CONTACT_WHATSAPP?.trim() ||
    "05344385541",
} as const;

export function absoluteUrl(
  path = "/",
): string {
  const normalizedPath =
    path.startsWith("/") ? path : `/${path}`;

  return `${siteConfig.url}${normalizedPath}`;
}

export function createSeoDescription(
  value: string | null | undefined,
  fallback: string = siteConfig.description,
): string {
  const normalizedValue = (value ?? "")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalizedValue) {
    return fallback;
  }

  if (normalizedValue.length <= 155) {
    return normalizedValue;
  }

  return `${normalizedValue.slice(0, 152).trimEnd()}...`;
}

export function serializeJsonLd(
  value: unknown,
): string {
  return JSON.stringify(value).replace(
    /</g,
    "\\u003c",
  );
}


export const seoRegions = productRegions;

export type SeoRegion =
  (typeof seoRegions)[number];

export function getSeoRegionBySlug(
  slug: string,
): SeoRegion | null {
  return (
    seoRegions.find(
      (region) => region.slug === slug,
    ) ?? null
  );
}
