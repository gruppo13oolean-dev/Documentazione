import { NextResponse, type NextRequest } from "next/server";
import { resolveFullscreenPdfPath } from "@/lib/docs";

export function middleware(request: NextRequest) {
  const docPath = resolveFullscreenPdfPath(request.nextUrl.pathname, request.nextUrl.searchParams);
  if (!docPath) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/api/public/pdf";
  url.search = `?path=${encodeURIComponent(docPath)}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/documenti/:path*"],
};
