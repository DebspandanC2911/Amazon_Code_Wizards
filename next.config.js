/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Optional: explicit domains for simple cases
    domains: [
      "localhost",
      "picsum.photos",
      "upload.wikimedia.org",
    ],
    // More powerful: match full URLs via patterns
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        port: "",
        pathname: "/**",
      },
      // If you really want to allow all HTTPS hosts, uncomment:
      // {
      //   protocol: "https",
      //   hostname: "**",
      //   port: "",
      //   pathname: "/**",
      // },
    ],
    // You can remove unoptimized if you want Next.js to optimize them
    unoptimized: true,

  },
  devIndicators: false,
}

module.exports = nextConfig
