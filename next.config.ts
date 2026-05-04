import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: isDev,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "api.resortian.com",
        pathname: "/images/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3005",
        pathname: "/images/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3005",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
