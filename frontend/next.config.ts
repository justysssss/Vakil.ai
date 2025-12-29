import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use Turbopack (Next.js 16+ default)
  turbopack: {},

  // Allow external images (e.g., Google profile pictures)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
