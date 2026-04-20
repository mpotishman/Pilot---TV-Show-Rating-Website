/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    domains: ['image.tmdb.org'], // allow images from TMDB
  },
  experimental: {
    scrollRestoration: false, // Add this line
  },
};

export default nextConfig;