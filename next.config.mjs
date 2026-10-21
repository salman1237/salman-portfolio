import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.resolve("."),
  experimental: {
    serverActions: {
      // Default is 1MB, which silently rejects real photo uploads before
      // our code ever runs. Images are capped at 5MB in lib/upload.ts —
      // leave headroom for multipart overhead and the other form fields.
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
