const withOptimizedImages = require('next-optimized-images')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
  },
  images: {
    domains: ["nftkitten.mo.cloudinary.net"],
  },
  rewrites: async () => [
    {
      source: '/original',
      destination: '/img/original.jpg',
    },
    {
      source: '/',
      destination: '/sol/home',
    },
  ],
}

module.exports = withOptimizedImages(nextConfig)
