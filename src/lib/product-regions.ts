export const productRegions = [
  {
    slug: "beylikduzu-escort",
    name: "Beylikdüzü Escort",
    shortName: "Beylikdüzü",
    title:
      "Beylikdüzü Escort İlanları | Güncel VIP Premium Gold",
    description:
      "Beylikdüzü escort ilanlarını VIP, Premium ve Gold kategorilerinde inceleyin. Güncel ilanlara, fotoğraflara ve WhatsApp iletişim seçeneklerine ulaşın.",
    h1: "Beylikdüzü Escort İlanları",
    intro:
      "Beylikdüzü çevresindeki güncel ilanları kategori bazlı inceleyebilir, ilan detaylarından fotoğrafları ve iletişim seçeneklerini görüntüleyebilirsiniz.",
    searchTerms: [
      "beylikdüzü",
      "beylikduzu",
      "beylikdüzü escort",
      "beylikduzu escort",
    ],
  },
  {
    slug: "avcilar-escort",
    name: "Avcılar Escort",
    shortName: "Avcılar",
    title:
      "Avcılar Escort İlanları | Güncel VIP Premium Gold",
    description:
      "Avcılar escort ilanlarını güncel liste halinde inceleyin. VIP, Premium ve Gold kategorilerindeki ilanlara hızlıca ulaşın.",
    h1: "Avcılar Escort İlanları",
    intro:
      "Avcılar çevresindeki güncel ilanları incelemek isteyen ziyaretçiler için VIP, Premium ve Gold kategorileri tek sayfada listelenir.",
    searchTerms: [
      "avcılar",
      "avcilar",
      "avcılar escort",
      "avcilar escort",
    ],
  },
  {
    slug: "esenyurt-escort",
    name: "Esenyurt Escort",
    shortName: "Esenyurt",
    title:
      "Esenyurt Escort İlanları | Güncel VIP Premium Gold",
    description:
      "Esenyurt escort ilanlarını kategori bazlı inceleyin. Güncel fotoğraflar, ilan detayları ve WhatsApp iletişim seçeneklerine ulaşın.",
    h1: "Esenyurt Escort İlanları",
    intro:
      "Esenyurt bölgesindeki güncel ilanlar için VIP, Premium ve Gold kategorilerinde listelenen içerikleri inceleyebilirsiniz.",
    searchTerms: [
      "esenyurt",
      "esenyurt escort",
    ],
  },
  {
    slug: "buyukcekmece-escort",
    name: "Büyükçekmece Escort",
    shortName: "Büyükçekmece",
    title:
      "Büyükçekmece Escort İlanları | Güncel VIP Premium Gold",
    description:
      "Büyükçekmece escort ilanlarını güncel kategorilerle inceleyin. VIP, Premium ve Gold ilanlara tek sayfadan ulaşın.",
    h1: "Büyükçekmece Escort İlanları",
    intro:
      "Büyükçekmece çevresindeki ilanları inceleyebilir, ilan detay sayfalarında fotoğraf ve iletişim bilgilerine ulaşabilirsiniz.",
    searchTerms: [
      "büyükçekmece",
      "buyukcekmece",
      "büyükçekmece escort",
      "buyukcekmece escort",
    ],
  },
  {
    slug: "istanbul-escort",
    name: "İstanbul Escort",
    shortName: "İstanbul",
    title:
      "İstanbul Escort İlanları | Güncel VIP Premium Gold",
    description:
      "İstanbul escort ilanlarını VIP, Premium ve Gold kategorilerinde inceleyin. Beylikdüzü, Avcılar, Esenyurt ve çevresindeki güncel ilanlara ulaşın.",
    h1: "İstanbul Escort İlanları",
    intro:
      "İstanbul genelindeki güncel ilanlar; Beylikdüzü, Avcılar, Esenyurt ve Büyükçekmece gibi bölgelere göre daha kolay keşfedilebilir.",
    searchTerms: [
      "istanbul",
      "istanbul escort",
      "beylikdüzü",
      "avcılar",
      "esenyurt",
      "büyükçekmece",
    ],
  },
] as const;

export type ProductRegion =
  (typeof productRegions)[number];

export function getProductRegionBySlug(
  slug: string | null | undefined,
): ProductRegion | null {
  if (!slug) {
    return null;
  }

  return (
    productRegions.find(
      (region) => region.slug === slug,
    ) ?? null
  );
}

export function isProductRegionSlug(
  value: string,
): boolean {
  return productRegions.some(
    (region) => region.slug === value,
  );
}
