/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators: false,
     eslint: {
    ignoreDuringBuilds: true, // ⚠️ Bypasses ESLint errors during `next build`
  },
};

export default nextConfig;

