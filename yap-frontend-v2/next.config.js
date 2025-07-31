/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // ⛔ Ignores TypeScript errors during build
  },
  eslint: {
    ignoreDuringBuilds: true, // ⛔ Ignores ESLint errors during build
  },
  webpack: (config) => {
    // You can add custom tweaks here if needed
    return config;
  },
};

module.exports = nextConfig;
