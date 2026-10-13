import type { NextConfig } from "next";

const defaultBasePath = "";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH !== undefined
  ? process.env.NEXT_PUBLIC_BASE_PATH
  : defaultBasePath;

const nextConfig: NextConfig = {
  basePath: basePath || undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
