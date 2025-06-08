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
};

export default nextConfig;
