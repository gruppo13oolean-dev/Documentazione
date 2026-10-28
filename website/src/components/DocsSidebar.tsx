"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, FileText, Folder as FolderIcon, FolderOpen, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { docHref, type Doc } from "@/lib/docs";
import type { Folder } from "@/lib/tree";

function FolderNode({ folder, current, depth }: { folder: Folder; current: string; depth: number }) {
  const active = current === folder.path;
  const inside = current === folder.path || current.startsWith(folder.path + "/");
  const [open, setOpen] = useState(inside);
  useEffect(() => {
    if (inside) setOpen(true);
  }, [inside]);
  return (
    <li>
      <div className="flex items-center" style={{ paddingLeft: depth * 12 }}>
        <button onClick={() => setOpen(!open)} aria-label={open ? "Chiudi" : "Apri"} className="p-1 text-muted-foreground hover:text-foreground">
          <ChevronRight className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-90" : ""}`} />
        </button>
        <Link
          href={docHref(folder.path)}
          onClick={() => setOpen(true)}
          className={`flex min-w-0 flex-1 items-center gap-2 rounded-md px-1.5 py-1 text-sm ${active ? "bg-primary/10 font-medium text-primary" : "hover:bg-muted"}`}
        >
          {open ? <FolderOpen className="h-4 w-4 shrink-0 text-primary" /> : <FolderIcon className="h-4 w-4 shrink-0 text-primary" />}
          <span className="truncate">{folder.name}</span>
        </Link>
      </div>
      {open && <Children folder={folder} current={current} depth={depth + 1} />}
    </li>
  );
}

function DocNode({ doc, current, depth }: { doc: Doc; current: string; depth: number }) {
  const active = current === doc.rel;
  return (
    <li style={{ paddingLeft: depth * 12 + 22 }}>
      <Link
        href={docHref(doc.rel)}
        className={`flex items-center gap-2 rounded-md px-1.5 py-1 text-sm ${active ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
      >
        <FileText className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{doc.title}</span>
      </Link>
    </li>
  );
}

function Children({ folder, current, depth }: { folder: Folder; current: string; depth: number }) {
  return (
    <ul>
      {folder.folders.map((f) => (
        <FolderNode key={f.path} folder={f} current={current} depth={depth} />
      ))}
      {folder.docs.map((d) => (
        <DocNode key={d.path} doc={d} current={current} depth={depth} />
      ))}
    </ul>
  );
}

export function DocsSidebar({ tree, docs }: { tree: Folder; docs: Doc[] }) {
  const params = useParams<{ slug?: string | string[] }>();
  const rawSlug = params?.slug;
  const current = Array.isArray(rawSlug)
    ? rawSlug.map((s) => decodeURIComponent(s)).join("/")
    : typeof rawSlug === "string"
      ? decodeURIComponent(rawSlug)
      : "";
  const [q, setQ] = useState("");
  const results = q ? docs.filter((d) => (d.title + " " + d.name).toLowerCase().includes(q.toLowerCase())) : [];

  return (
    <nav className="flex flex-col gap-3">
      <label className="relative block">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cerca..."
          className="w-full rounded-md border bg-card py-2 pl-8 pr-3 text-sm outline-none focus:border-primary"
        />
      </label>
      <Link
        href="/documenti"
        className={`rounded-md px-2 py-1 font-display text-sm font-semibold hover:bg-muted ${current === "" ? "bg-primary/10 text-primary" : ""}`}
      >
        Tutti i documenti
      </Link>
      {q ? (
        <ul>
          {results.length === 0 && <li className="px-2 text-sm text-muted-foreground">Nessun risultato</li>}
          {results.map((d) => (
            <DocNode key={d.path} doc={d} current={current} depth={-1} />
          ))}
        </ul>
      ) : (
        <Children folder={tree} current={current} depth={0} />
      )}
    </nav>
  );
}
