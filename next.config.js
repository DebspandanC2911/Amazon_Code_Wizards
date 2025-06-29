/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Add environment-specific configurations
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Enable standalone output for Docker deployments
  output: process.env.NODE_ENV === "production" ? "standalone" : undefined,

  // Experimental features to help with hydration
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  // Webpack configuration to help with hydration issues
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
  devIndicators: false,
}

module.exports = nextConfig
