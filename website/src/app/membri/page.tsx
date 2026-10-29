import type { Metadata } from "next";
import { members, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Membri — 13oolean",
  description: "I membri del gruppo 13oolean, Università di Padova.",
  openGraph: {
    title: "Membri — 13oolean",
    description: "Chi fa parte del gruppo 13oolean.",
  },
};

export default function Members() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <h1 className="text-4xl font-bold">Membri</h1>
      <p className="mt-2 text-muted-foreground">Il gruppo {site.name}.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m) => {
          const parts = m.name.trim().split(/\s+/);
          const initials = `${parts[0]?.[0] ?? ""}${parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : ""}`.toUpperCase();
          return (
            <div key={m.name} className="flex items-center gap-4 rounded-lg border bg-card p-5 shadow-card">
              <span className="clip-bevel flex h-12 w-12 items-center justify-center bg-brand font-display font-bold text-primary-foreground">
                {initials}
              </span>
              <div>
                <div className="font-display font-semibold">{m.name}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
