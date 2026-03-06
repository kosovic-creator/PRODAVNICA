import path from "path";
import type { Configuration } from "webpack";

const nextConfig = {
  turbopack: {
    root: path.resolve(__dirname, '..'),
    resolveAlias: {
      '@': './',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
    qualities: [90],
  },

  webpack: (config: Configuration): Configuration => {
    if (config.resolve && config.resolve.alias) {
      (config.resolve.alias as Record<string, string>)['@'] = path.resolve(__dirname);
    }

    // Add support for Prisma WASM modules
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    return config;
  },
};

export default nextConfig;
