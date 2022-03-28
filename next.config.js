const withOptimizedImages = require('next-optimized-images')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    images: { layoutRaw: true },
  },
  images: {
    domains: ['nftkitten.mo.cloudinary.net'],
  },
  rewrites: async () => [
    {
      source: '/',
      destination: '/sol/home',
    },
  ],
  redirects: async () => [
    {
      source: '/original',
      destination: '/img/original.jpg',
    },
  ],
}

module.exports = withOptimizedImages(nextConfig)
