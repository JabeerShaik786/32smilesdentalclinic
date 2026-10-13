import type { NextConfig } from "next";

// When building for production export / GitHub Pages, default to repository subpath /32smilesdentalclinic
// Keep local development (npm run dev) at "" (root) unless NEXT_PUBLIC_BASE_PATH is explicitly set
const isProd = process.env.NODE_ENV === "production";
const defaultBasePath = isProd ? "/32smilesdentalclinic" : "";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH !== undefined
  ? process.env.NEXT_PUBLIC_BASE_PATH
  : defaultBasePath;

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
