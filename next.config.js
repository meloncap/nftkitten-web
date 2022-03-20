/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
  },
  images: {
    domains: ["nftkitten.mo.cloudinary.net"]
  },
  rewrites: async () => [
    {
      source: '/original',
      destination: '/',
    },
  ],
}

module.exports = nextConfig
