/** @type {import('next').NextConfig} */
const nextConfig = {
  // React strict mode for better development experience
  reactStrictMode: true,
  
  // Allowed image domains for next/image
  images: {
    domains: ['picsum.photos', 'images.unsplash.com'],
  },

  // Suppress specific ESLint rules for demo purposes
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable type checking during builds for faster deployment
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
