/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-leaflet'],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

module.exports = nextConfig; 