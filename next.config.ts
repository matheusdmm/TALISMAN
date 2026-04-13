import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    formats: ['image/webp', 'image/avif'], // Prefer modern formats
    minimumCacheTTL: 60, // Cache optimized images for 60 seconds (adjust as needed)
  },
  allowedDevOrigins: ['192.168.0.3', 'localhost:3000'],
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // Remove console.log in production
  },
  output: 'standalone', // Enables standalone output
};

module.exports = withBundleAnalyzer(nextConfig);
