import type { NextConfig } from "next";

// Портал vibe.kiselevgroup.com проксирует /code/<user>/proxy/3000/* на localhost:3000/*
// и срезает префикс для СТРАНИЦ, но браузер запрашивает АССЕТЫ с префиксом.
// Решение: assetPrefix добавляет префикс к ссылкам на ассеты,
// а middleware (src/middleware.ts) срезает его обратно при обработке.
const PROXY_PREFIX = process.env.NEXT_PROXY_PREFIX ?? "/code/crmby/proxy/3000";

const nextConfig: NextConfig = {
  assetPrefix: PROXY_PREFIX,
  allowedDevOrigins: ["vibe.kiselevgroup.com"],
  env: {
    NEXT_PUBLIC_PROXY_PREFIX: PROXY_PREFIX,
  },
};

export default nextConfig;
