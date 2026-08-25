/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "glamstudio.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;