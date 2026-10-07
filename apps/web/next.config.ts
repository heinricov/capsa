import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: [
    "@workspace/client",
    "@workspace/constants",
    "@workspace/env",
    "@workspace/errors",
    "@workspace/ui",
  ],
}

export default nextConfig
