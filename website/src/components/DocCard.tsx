import Link from "next/link";
import { FileText } from "lucide-react";
import type { Doc } from "@/lib/docs";
import { docHref, formatDate } from "@/lib/docs";

export function DocCard({ doc }: { doc: Doc }) {
  return (
    <Link
      href={docHref(doc.rel)}
      className="group flex items-start gap-4 rounded-lg border bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/50"
    >
      <span className="clip-bevel flex h-10 w-10 shrink-0 items-center justify-center bg-brand text-primary-foreground">
        <FileText className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block truncate font-display font-semibold group-hover:text-primary">{doc.title}</span>
        <span className="mt-1 block text-xs text-muted-foreground">
          {doc.category}
          {doc.date && ` · ${formatDate(doc.date)}`}
        </span>
      </span>
    </Link>
  );
}
