import { NextRequest, NextResponse } from "next/server";

// Префикс прокси портала. Портал обрезает его при форвардинге страниц,
// но браузер запрашивает ассеты с ним — возвращаем префикс обратно
// для запросов к _next и статике.
const PROXY_PREFIX = "/code/crmby/proxy/3000";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith(`${PROXY_PREFIX}/`)) {
    const stripped = pathname.slice(PROXY_PREFIX.length);
    const url = req.nextUrl.clone();
    url.pathname = stripped;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/code/:path*"],
};
