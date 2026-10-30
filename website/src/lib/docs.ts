import { site } from "./site";

export type Doc = {
  path: string; // percorso completo nel repo, es. output/Verbali/.../file.pdf
  rel: string; // percorso relativo a output/
  name: string;
  title: string;
  categories: string[]; // cartelle, escluso il nome della cartella del file stesso
  category: string;
  date: string | null; // YYYY-MM-DD
  size: number;
};

const DATE_RE = /(\d{4}-\d{2}-\d{2})/;

export function toDoc(path: string, size: number, root: string): Doc | null {
  if (!path.startsWith(root + "/") || !path.toLowerCase().endsWith(".pdf")) return null;
  const rel = path.slice(root.length + 1);
  const parts = rel.split("/");
  const name = parts[parts.length - 1] ?? "";
  const base = name.replace(/\.pdf$/i, "");
  let folders = parts.slice(0, -1);
  // cartella che contiene solo il file con lo stesso nome: non è una categoria
  if (folders.length && folders[folders.length - 1] === base) folders = folders.slice(0, -1);
  const date = base.match(DATE_RE)?.[1] ?? null;
  const title = base
    .replace(DATE_RE, "")
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
  return {
    path,
    rel,
    name,
    title: date ? `${title} ${formatDate(date)}` : title,
    categories: folders,
    category: folders.join(" / ") || "Generale",
    date,
    size,
  };
}

export function formatDate(d: string) {
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

export function sortDocs(docs: Doc[]) {
  return [...docs].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? "") || a.title.localeCompare(b.title));
}

export function docHref(relOrPath: string) {
  if (!relOrPath) return "/documenti";
  return `/documenti/${relOrPath.split("/").map(encodeURIComponent).join("/")}`;
}

// Proxy di sola lettura: serve i PDF pubblici del repo con content-type corretto
// così il browser li mostra in anteprima. Accetta solo .pdf sotto output/.
export function isAllowedPath(p: string | null): p is string {
  if (!p || p.length > 500) return false;
  if (p.includes("..") || p.includes("\\") || p.startsWith("/")) return false;
  return p.startsWith(site.docsRoot + "/") && p.toLowerCase().endsWith(".pdf");
}

export function resolveFullscreenPdfPath(pathname: string, searchParams: URLSearchParams): string | null {
  if (!pathname.startsWith("/documenti/")) return null;

  let rawSlug = pathname.slice("/documenti/".length).replace(/\/+$/, "");
  const hasPathSuffix = rawSlug.toLowerCase().endsWith("/fullscreen");
  if (hasPathSuffix) {
    rawSlug = rawSlug.slice(0, -"/fullscreen".length);
  }

  const fullscreenParam = searchParams.get("fullscreen");
  const hasQueryParam =
    searchParams.has("fullscreen") && fullscreenParam !== "false" && fullscreenParam !== "0";

  if (!hasPathSuffix && !hasQueryParam) return null;

  let decodedRel: string;
  try {
    decodedRel = rawSlug
      .split("/")
      .filter(Boolean)
      .map((s) => decodeURIComponent(s))
      .join("/");
  } catch {
    return null;
  }

  const docPath = `${site.docsRoot}/${decodedRel}`;
  return isAllowedPath(docPath) ? docPath : null;
}
