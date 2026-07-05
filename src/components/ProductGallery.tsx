"use client";

import Image from "next/image";
import { useState } from "react";

type ProductGalleryProps = {
  productName: string;
  images: string[];
};

export function ProductGallery({
  productName,
  images,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-[28px] bg-neutral-100 text-sm text-neutral-500">
        Ürün görseli bulunmuyor.
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <div className="relative mx-auto h-[58svh] min-h-[280px] max-h-[520px] w-full max-w-[760px] overflow-hidden rounded-[24px] bg-neutral-950 sm:h-[68svh] sm:min-h-[420px] sm:max-h-[680px] sm:rounded-[28px]">
        <Image
          key={images[activeIndex]}
          src={images[activeIndex]}
          alt={`${productName} - görsel ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 760px"
          className="object-contain"
        />

        <div className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {images.length > 1 ? (
        <div className="mx-auto mt-3 flex max-w-[760px] gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => {
            const isActive = activeIndex === index;

            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`${index + 1}. görseli aç`}
                className={`relative size-[68px] shrink-0 overflow-hidden rounded-xl border-2 bg-neutral-100 transition sm:size-20 ${
                  isActive
                    ? "border-neutral-950 opacity-100"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={image}
                  alt={`${productName} küçük görsel ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}