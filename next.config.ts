import type { NextConfig } from "next";

const remotePatterns: NonNullable<
  NextConfig["images"]
>["remotePatterns"] = [
  {
    protocol: "https",
    hostname: "images.unsplash.com",
    port: "",
    pathname: "/**",
  },
];

const r2PublicUrl =
  process.env.R2_PUBLIC_URL?.trim();

if (r2PublicUrl) {
  try {
    const parsedR2Url = new URL(
      r2PublicUrl,
    );

    remotePatterns.push({
      protocol: "https",
      hostname: parsedR2Url.hostname,
      port: "",
      pathname: "/**",
    });
  } catch {
    console.warn(
      "R2_PUBLIC_URL geçersiz olduğu için image remotePatterns içine eklenmedi.",
    );
  }
}

const nextConfig: NextConfig = {
  images: {
    /**
     * Vercel Image Transformations limitinin dolmaması için
     * Next.js image optimization kapalı.
     *
     * Görseller direkt R2 / dış kaynak üzerinden servis edilir.
     */
    unoptimized: true,

    /**
     * next/image dış görselleri doğrulamaya devam eder.
     * Bu yüzden remotePatterns kalmalı.
     */
    remotePatterns,
  },
};

export default nextConfig;