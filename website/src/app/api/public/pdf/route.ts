import { isAllowedPath, resolveFullscreenPdfPath } from "@/lib/docs";
import { site } from "@/lib/site";

export async function GET(request: Request) {
  const reqUrl = new URL(request.url);
  const path = reqUrl.searchParams.get("path") ?? resolveFullscreenPdfPath(reqUrl.pathname, reqUrl.searchParams);
  if (!isAllowedPath(path)) return new Response("Bad request", { status: 400 });
  const url = `https://raw.githubusercontent.com/${site.repoOwner}/${site.repoName}/${site.branch}/${path
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
  const res = await fetch(url);
  if (!res.ok) return new Response("Not found", { status: res.status === 404 ? 404 : 502 });
  const filename = path.split("/").pop()!.replace(/"/g, "");
  return new Response(res.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
