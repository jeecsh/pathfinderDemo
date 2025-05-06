/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'raw.githubusercontent.com',
      'cdnjs.cloudflare.com',
    ],
  },
  transpilePackages: ['react-leaflet'],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false,
      dns: false,
      tls: false,
      fs: false,
      request: false,
    };
    return config;
  },
}

module.exports = nextConfig;
