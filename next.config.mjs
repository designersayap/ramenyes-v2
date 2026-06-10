/** @type {import('next').NextConfig} */
const nextConfig = {
  // Comment/remove output: 'export' to enable dynamic API routes (Forms/Proxy) locally or on dynamic hosting.
  // output: 'export',
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: true,
  experimental: {
    inlineCss: true,
  },
};
export default nextConfig;
