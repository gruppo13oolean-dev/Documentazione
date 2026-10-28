import type { ReactNode } from "react";
import { listDocs } from "@/lib/docs.functions";
import { buildTree } from "@/lib/tree";
import { DocsSidebar } from "@/components/DocsSidebar";

export default async function DocsLayout({ children }: { children: ReactNode }) {
  const data = await listDocs();
  const tree = buildTree(data.docs);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 md:flex-row">
      <aside className="md:sticky md:top-20 md:max-h-[calc(100vh-6rem)] md:w-72 md:shrink-0 md:overflow-y-auto md:border-r md:pr-4">
        <details className="md:hidden rounded-lg border bg-card p-3">
          <summary className="cursor-pointer font-display text-sm font-semibold">Navigazione</summary>
          <div className="mt-3"><DocsSidebar tree={tree} docs={data.docs} /></div>
        </details>
        <div className="hidden md:block"><DocsSidebar tree={tree} docs={data.docs} /></div>
      </aside>
      <div className="min-w-0 flex-1">
        {data.error && <p className="mb-4 text-sm text-destructive">{data.error}</p>}
        {children}
      </div>
    </div>
  );
}
