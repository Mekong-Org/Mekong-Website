import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // middleware.ts matches /api/admin/:path*, which makes Next clone the
    // request body for the middleware layer. The default 10MB clone limit
    // silently truncates larger bodies mid-multipart-boundary, so uploads
    // over ~10MB hit "Failed to parse body as FormData" instead of our own
    // "over 20MB" validation error. Raise it well above MAX_SIZE in
    // src/app/api/admin/upload/route.ts so oversized files always reach
    // that clean check.
    middlewareClientMaxBodySize: 40 * 1024 * 1024,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.zyrosite.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
