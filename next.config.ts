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

const r2PublicUrl = process.env.R2_PUBLIC_URL?.trim();

if (r2PublicUrl) {
  const parsedR2Url = new URL(r2PublicUrl);

  remotePatterns.push({
    protocol: "https",
    hostname: parsedR2Url.hostname,
    port: "",
    pathname: "/**",
  });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;