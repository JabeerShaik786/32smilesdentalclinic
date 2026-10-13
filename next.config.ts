import type { NextConfig } from "next";

// Production custom domain (32smilesdentalclinic.com) serves from root "/".
// Do not use the repository subpath "/32smilesdentalclinic".
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
