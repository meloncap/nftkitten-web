/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/original',
        destination: '/',
      },
    ]
  }
}
module.exports = nextConfig
