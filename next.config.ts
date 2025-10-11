import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable source maps for production debugging
  productionBrowserSourceMaps: true,
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // Enable experimental features if needed
  experimental: {
    serverActions: {
      allowedOrigins: ['irrelevant-nellie-fodi999-aefe2c9f.koyeb.app'],
    },
  },
  // Configure headers for CORS if needed
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://irrelevant-nellie-fodi999-aefe2c9f.koyeb.app',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
