/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
  },
  images: {
    domains: ["nftkitten.mo.cloudinary.net", "pbs.twimg.com"]
  },
  rewrites: async () => [
    {
      source: '/original',
      destination: '/',
    },
  ],
}

module.exports = nextConfig
