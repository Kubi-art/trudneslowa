import type { NextConfig } from "next";

// STATIC_EXPORT=1 builds a plain static copy into /out (used for previews).
// On Vercel, leave it unset.
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(staticExport
    ? { output: "export", images: { unoptimized: true }, trailingSlash: true, assetPrefix: "." }
    : { cacheComponents: true, partialPrefetching: true }),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
