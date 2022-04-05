/* eslint-disable @typescript-eslint/no-var-requires */
const withOptimizedImages = require('next-optimized-images')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    images: { layoutRaw: true },
  },
  images: {
    domains: ['nftkittenmedia.mo.cloudinary.net'],
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
      permanent: true,
    },
  ],
}

module.exports = withOptimizedImages(nextConfig)
