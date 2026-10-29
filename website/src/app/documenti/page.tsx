import type { Metadata } from "next";
import { listDocs } from "@/lib/docs.functions";
import { buildTree } from "@/lib/tree";
import { FolderView } from "@/components/FolderView";

export const metadata: Metadata = {
  title: "Documenti — 13oolean",
  description: "Tutti i verbali e i documenti del gruppo 13oolean, organizzati per cartelle.",
  openGraph: {
    title: "Documenti — 13oolean",
    description: "Verbali e documenti del gruppo 13oolean.",
  },
};

export default async function Docs() {
  const data = await listDocs();
  const tree = buildTree(data.docs);
  return <FolderView folder={tree} />;
}
