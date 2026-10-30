import { NextResponse, type NextRequest } from "next/server";
import { resolveDocPdfPath } from "@/lib/docs";

export function middleware(request: NextRequest) {
  const docPath = resolveDocPdfPath(request.nextUrl.pathname);
  if (!docPath) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/api/public/pdf";
  url.search = `?path=${encodeURIComponent(docPath)}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/documenti/:path*"],
};
