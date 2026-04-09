import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Allow mobile devices on the local network to access dev resources
  allowedDevOrigins: ['192.168.0.3', 'localhost:3000'],
};

export default nextConfig;
