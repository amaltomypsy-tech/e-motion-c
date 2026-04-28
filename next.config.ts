import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Silences "inferred workspace root" warnings when multiple lockfiles exist outside the app folder.
  outputFileTracingRoot: dirname,
  
  // When opening the dev server via LAN IP, Next can consider _next assets "cross origin".
  // Add explicit allowed origins for development LAN access.
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://10.51.111.35:3000"
  ],
  
  // Image optimization for production
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },

  // Environment variable configuration
  env: {
    NEXT_PUBLIC_APP_NAME: "EI Story Assessment",
  },

  // Headers for production
  headers: async () => [
    {
      source: "/api/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "no-cache, no-store, must-revalidate",
        },
      ],
    },
    {
      source: "/audio/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
  ],

  // Redirects configuration
  redirects: async () => [
    {
      source: "/index",
      destination: "/",
      permanent: true,
    },
  ],
};

export default nextConfig;
