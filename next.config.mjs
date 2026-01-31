/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  swcMinify: true,
  // Enable Static Generation with ISR
  staticPageGenerationTimeout: 120, // 2 minutes per page
  reactStrictMode: true,
  // Optimize for static generation
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  // Enable incremental static regeneration
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400'
          }
        ]
      }
    ]
  }
};

export default nextConfig;
