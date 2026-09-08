import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev-only badge, and it spends its time reporting hydration mismatches that
  // browser extensions cause by rewriting the DOM before React boots (e.g.
  // Bitdefender's bis_skin_checked attribute) — noise we cannot fix from here.
  // Real breakage still interrupts: build failures and uncaught runtime errors
  // keep showing their overlay. No effect on the production build.
  devIndicators: false,
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
