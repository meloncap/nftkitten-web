/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
  },
  rewrites: async () => [
    {
      source: '/original',
      destination: '/',
    },
  ],
}

module.exports = nextConfig
