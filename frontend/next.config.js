/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  compress: true,
  poweredByHeader: false,
}

module.exports = nextConfig
