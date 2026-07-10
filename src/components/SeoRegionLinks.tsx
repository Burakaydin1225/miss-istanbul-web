import Link from "next/link";

import { seoRegions } from "@/lib/site-config";

type SeoRegionLinksProps = {
  regionSlugs?: readonly string[];
};

export function SeoRegionLinks({
  regionSlugs,
}: SeoRegionLinksProps) {
  const displayedRegions = regionSlugs
    ? seoRegions.filter((region) =>
        regionSlugs.includes(region.slug),
      )
    : seoRegions;

  if (displayedRegions.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="popular-regions-title"
      className="mx-auto mb-5 max-w-5xl rounded-[18px] border border-black/10 bg-white/90 px-3 py-3.5 shadow-sm sm:px-5 sm:py-4"
    >
      <div className="text-center">
        <h2
          id="popular-regions-title"
          className="text-sm font-black tracking-[-0.02em] text-neutral-950 sm:text-base"
        >
          İstanbul bölge ilanları
        </h2>

        <p className="mt-1 text-[11px] leading-5 text-neutral-500 sm:text-xs">
          Aktif ilan bulunan bölgeleri inceleyin.
        </p>
      </div>

      <nav
        aria-label="İstanbul escort bölgeleri"
        className="mt-3 flex flex-wrap items-center justify-center gap-2"
      >
        {displayedRegions.map((region) => (
          <Link
            key={region.slug}
            href={`/bolge/${region.slug}`}
            className="rounded-full border border-fuchsia-200 bg-fuchsia-50 px-3 py-1.5 text-[11px] font-bold text-fuchsia-700 transition hover:border-fuchsia-400 hover:bg-fuchsia-100"
          >
            {region.name}
          </Link>
        ))}
      </nav>
    </section>
  );
}