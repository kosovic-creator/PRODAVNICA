import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
    qualities: [75, 90],
  },
  turbopack: {
    root: path.resolve(__dirname, '..'),
  },
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-pg'],
};

export default nextConfig;
