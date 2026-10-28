import Link from "next/link";
import { ChevronRight, FileText, Folder as FolderIcon } from "lucide-react";
import { docHref, formatDate } from "@/lib/docs";
import { countDocs, type Folder } from "@/lib/tree";

export function Breadcrumbs({ path, last }: { path: string; last?: string }) {
  const parts = path ? path.split("/") : [];
  return (
    <div className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
      <Link href="/documenti" className="hover:text-foreground">Documenti</Link>
      {parts.map((p, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href={docHref(parts.slice(0, i + 1).join("/"))} className="hover:text-foreground">{p}</Link>
        </span>
      ))}
      {last && (
        <span className="flex items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">{last}</span>
        </span>
      )}
    </div>
  );
}

export function FolderView({ folder }: { folder: Folder }) {
  const empty = folder.folders.length === 0 && folder.docs.length === 0;
  return (
    <div>
      <Breadcrumbs path={folder.path} />
      <h1 className="mt-3 text-3xl font-bold">{folder.name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{countDocs(folder)} documenti</p>
      <div className="mt-6 overflow-hidden rounded-lg border bg-card shadow-card">
        {empty && <p className="p-6 text-sm text-muted-foreground">Cartella vuota.</p>}
        <ul className="divide-y">
          {folder.folders.map((f) => (
            <li key={f.path}>
              <Link href={docHref(f.path)} className="flex items-center gap-3 px-4 py-3 hover:bg-muted">
                <FolderIcon className="h-5 w-5 text-primary" />
                <span className="flex-1 font-medium">{f.name}</span>
                <span className="text-xs text-muted-foreground">{countDocs(f)} file</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </li>
          ))}
          {folder.docs.map((d) => (
            <li key={d.path}>
              <Link href={docHref(d.rel)} className="flex items-center gap-3 px-4 py-3 hover:bg-muted">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="flex-1 truncate">{d.title}</span>
                <span className="text-xs text-muted-foreground">{d.date ? formatDate(d.date) : ""}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
