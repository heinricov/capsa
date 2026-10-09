import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: [
    "@workspace/client",
    "@workspace/constants",
    "@workspace/env",
    "@workspace/errors",
    "@workspace/web",
  ],
}

export default nextConfig
