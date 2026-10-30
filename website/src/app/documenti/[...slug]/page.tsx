import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listDocs } from "@/lib/docs.functions";
import { buildTree, findFolder, type Folder } from "@/lib/tree";
import { FolderView } from "@/components/FolderView";

async function resolveFolder(slug: string[]): Promise<Folder | null> {
  const { docs } = await listDocs();
  const p = slug.map((s) => decodeURIComponent(s)).join("/");
  return findFolder(buildTree(docs), p) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const folder = await resolveFolder(slug);
  const name = folder ? folder.name : "Documenti";
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
  const folder = await resolveFolder(slug);
  if (!folder) notFound();

  return <FolderView folder={folder} />;
}
