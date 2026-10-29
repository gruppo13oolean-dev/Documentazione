import { site } from "./site";
import { sortDocs, toDoc, type Doc } from "./docs";

let cache: { at: number; docs: Doc[] } | null = null;
const TTL = 5 * 60 * 1000;

export async function listDocs(): Promise<{ docs: Doc[]; error: string | null }> {
  if (cache && Date.now() - cache.at < TTL) return { docs: cache.docs, error: null };
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "13oolean-docs",
  };
  // Opzionale: token solo lato server (variabile d'ambiente), mai nel browser.
  const token = process.env["GITHUB_TOKEN"];
  if (token) headers["Authorization"] = `Bearer ${token}`;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${site.repoOwner}/${site.repoName}/git/trees/${site.branch}?recursive=1`,
      {
        headers,
        next: { revalidate: 300 },
      },
    );
    if (!res.ok) {
      console.error(`GitHub tree failed [${res.status}]: ${await res.text()}`);
      return { docs: cache?.docs ?? [], error: "Impossibile leggere i documenti da GitHub in questo momento." };
    }
    const json = (await res.json()) as { tree: { path: string; type: string; size?: number }[] };
    const docs = sortDocs(
      json.tree
        .filter((t) => t.type === "blob")
        .map((t) => toDoc(t.path, t.size ?? 0, site.docsRoot))
        .filter((d): d is Doc => d !== null),
    );
    cache = { at: Date.now(), docs };
    return { docs, error: null };
  } catch (e) {
    console.error(e);
    return { docs: cache?.docs ?? [], error: "Impossibile leggere i documenti da GitHub in questo momento." };
  }
}
