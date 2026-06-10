/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use 'standalone' to enable dynamic API routes (Forms/Proxy) in Docker deployments
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: true,
  experimental: {
    inlineCss: true,
  },
};
export default nextConfig;
