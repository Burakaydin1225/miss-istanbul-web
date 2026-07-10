import Link from "next/link";

import { seoRegions } from "@/lib/site-config";

export function SeoRegionLinks() {
  return (
    <section
      aria-label="Popüler bölgeler"
      className="mx-auto mb-4 max-w-5xl rounded-[18px] border border-black/10 bg-white/85 px-3 py-3 shadow-sm sm:px-4"
    >
      <div className="flex flex-wrap items-center justify-center gap-2">
        {seoRegions.map((region) => (
          <Link
            key={region.slug}
            href={`/bolge/${region.slug}`}
            className="rounded-full border border-fuchsia-200 bg-fuchsia-50 px-3 py-1.5 text-[11px] font-bold text-fuchsia-700 transition hover:border-fuchsia-400 hover:bg-fuchsia-100"
          >
            {region.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
