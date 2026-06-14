import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Фото уменьшаются на клиенте (~1280px JPEG), но даём запас на крупные/HEIC файлы.
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
