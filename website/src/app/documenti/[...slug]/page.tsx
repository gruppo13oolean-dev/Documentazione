import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Download, Github, Maximize2 } from "lucide-react";
import { listDocs } from "@/lib/docs.functions";
import { docHref, formatDate, type Doc } from "@/lib/docs";
import { buildTree, findFolder, type Folder } from "@/lib/tree";
import { repoUrl, site } from "@/lib/site";
import { Breadcrumbs, FolderView } from "@/components/FolderView";

type Data = { kind: "doc"; doc: Doc } | { kind: "folder"; folder: Folder };

async function resolveData(slug: string[]): Promise<Data | null> {
  const { docs } = await listDocs();
  const p = slug.map((s) => decodeURIComponent(s)).join("/");
  const doc = docs.find((d) => d.rel === p);
  if (doc) return { kind: "doc", doc };
  const folder = findFolder(buildTree(docs), p);
  if (folder) return { kind: "folder", folder };
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const loaderData = await resolveData(slug);
  const name = loaderData ? (loaderData.kind === "doc" ? loaderData.doc.title : loaderData.folder.name) : "Documento";
  return {
    title: `${name} — 13oolean`,
    description: `${name} — documentazione del gruppo 13oolean.`,
    openGraph: {
      title: `${name} — 13oolean`,
      description: "Documentazione del gruppo 13oolean.",
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const data = await resolveData(slug);
  if (!data) notFound();

  if (data.kind === "folder") return <FolderView folder={data.folder} />;
  const doc = data.doc;
  const src = `/api/public/pdf?path=${encodeURIComponent(doc.path)}`;
  const gh = `${repoUrl}/blob/${site.branch}/${doc.path.split("/").map(encodeURIComponent).join("/")}`;

  return (
    <div>
      <Breadcrumbs path={doc.categories.join("/")} last={doc.title} />
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{doc.title}</h1>
          {doc.date && <p className="mt-1 text-sm text-muted-foreground">{formatDate(doc.date)}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={src} download={doc.name} className="clip-bevel inline-flex items-center gap-2 bg-brand px-4 py-2 text-sm font-medium text-primary-foreground">
            <Download className="h-4 w-4" /> Scarica
          </a>
          <a
            href={`${docHref(doc.rel)}?fullscreen`}
            className="inline-flex items-center gap-2 rounded-md border bg-card px-4 py-2 text-sm font-medium hover:border-primary/50"
          >
            <Maximize2 className="h-4 w-4" /> Schermo intero
          </a>
          <a href={gh} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border bg-card px-4 py-2 text-sm font-medium hover:border-primary/50">
            <Github className="h-4 w-4" /> GitHub
          </a>
        </div>
      </div>
      <iframe title={doc.title} src={src} className="mt-6 h-[80vh] w-full rounded-lg border bg-card shadow-card" />
    </div>
  );
}
