import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "100MB",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
      },
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
      },
    ],
  },
};

// Check if experimental features are supported (optional safeguard)
if (process.env.NODE_ENV === "production" && !nextConfig.experimental) {
  console.warn("Experimental features are not supported in this version of Next.js.");
}

export default nextConfig;
