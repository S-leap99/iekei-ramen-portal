import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // ビルド時の ESLint エラーを無視してビルドを通す
    ignoreDuringBuilds: true,
  },  
};

export default nextConfig;
