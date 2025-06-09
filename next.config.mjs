/** @type {import('next').NextConfig} */
const nextConfig = {
  // Silence warnings
  // https://github.com/WalletConnect/walletconnect-monorepo/issues/1908
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");

    // Speed up builds
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      },
    };

    return config;
  },

  // Faster builds in development
  swcMinify: true,

  // Reduce bundle analysis in dev
  experimental: {
    optimizeCss: false, // Disable in dev for speed
    esmExternals: "loose",
  },

  // Skip type checking during build (faster)
  typescript: {
    ignoreBuildErrors: true,
  },

  // Skip ESLint during build (faster)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Configure external image domains
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "imagedelivery.net", // Farcaster profile images
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Common NFT images
      },
      {
        protocol: "https",
        hostname: "ipfs.io", // IPFS images
      },
    ],
  },
};

export default nextConfig;
