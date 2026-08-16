import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/dashboard/drafts": ["content/drafts/**/*"],
    "/dashboard/drafts/*": ["content/drafts/**/*"],
  },
};

export default nextConfig;
