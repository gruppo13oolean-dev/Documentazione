import type { Doc } from "./docs";

export type Folder = { name: string; path: string; folders: Folder[]; docs: Doc[] };

export function buildTree(docs: Doc[]): Folder {
  const root: Folder = { name: "Documenti", path: "", folders: [], docs: [] };
  for (const d of docs) {
    let cur = root;
    for (const part of d.categories) {
      const path = cur.path ? `${cur.path}/${part}` : part;
      let next = cur.folders.find((f) => f.name === part);
      if (!next) {
        next = { name: part, path, folders: [], docs: [] };
        cur.folders.push(next);
      }
      cur = next;
    }
    cur.docs.push(d);
  }
  const sort = (f: Folder) => {
    f.folders.sort((a, b) => a.name.localeCompare(b.name));
    f.folders.forEach(sort);
  };
  sort(root);
  return root;
}

export function findFolder(root: Folder, path: string): Folder | null {
  if (!path) return root;
  let cur: Folder | undefined = root;
  for (const part of path.split("/")) {
    cur = cur?.folders.find((f) => f.name === part);
    if (!cur) return null;
  }
  return cur;
}

export function countDocs(f: Folder): number {
  return f.docs.length + f.folders.reduce((n, c) => n + countDocs(c), 0);
}
