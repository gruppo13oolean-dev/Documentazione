import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText, Github, Mail, Users } from "lucide-react";
import { listDocs } from "@/lib/docs.functions";
import { repoUrl, site } from "@/lib/site";
import { DocCard } from "@/components/DocCard";

export const metadata: Metadata = {
  title: "13oolean — Documentazione di progetto",
  description: "Gruppo 13oolean, Università di Padova: verbali e documenti di progetto sempre aggiornati.",
  openGraph: {
    title: "13oolean — Documentazione di progetto",
    description: "Verbali e documenti del gruppo 13oolean, Università di Padova.",
  },
};

export default async function Index() {
  const data = await listDocs();
  const latest = data.docs.slice(0, 4);
  const links = [
    { icon: FileText, label: "Tutti i documenti", desc: `${data.docs.length} PDF disponibili`, to: "/documenti" as const },
    { icon: Users, label: "Membri del gruppo", desc: "Chi siamo", to: "/membri" as const },
  ];

  return (
    <>
      <section className="grid-bg relative border-b">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{site.university}</p>
          <h1 className="mt-4">
            <Image
              src="/logo.png"
              alt="13oolean"
              width={2400}
              height={768}
              priority
              className="h-16 w-auto sm:h-24 md:h-28 object-contain -ml-1"
            />
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Documentazione di progetto del gruppo per il corso di {site.course}, {site.year}.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/documenti" className="clip-bevel inline-flex items-center gap-2 bg-brand px-5 py-3 font-medium text-primary-foreground">
              Vai ai documenti <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border bg-card px-5 py-3 font-medium hover:border-primary/50">
              <Github className="h-4 w-4" /> Repository
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-14">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Link rapidi</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {links.map((l) => (
            <Link key={l.to} href={l.to} className="rounded-lg border bg-card p-5 shadow-card hover:border-primary/50">
              <l.icon className="h-5 w-5 text-primary" />
              <div className="mt-3 font-display font-semibold">{l.label}</div>
              <div className="text-sm text-muted-foreground">{l.desc}</div>
            </Link>
          ))}
          <a href={`mailto:${site.email}`} className="rounded-lg border bg-card p-5 shadow-card hover:border-primary/50">
            <Mail className="h-5 w-5 text-primary" />
            <div className="mt-3 font-display font-semibold">Contatti</div>
            <div className="text-sm text-muted-foreground">{site.email}</div>
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-14">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Ultimi documenti</h2>
        {data.error && <p className="mt-4 text-sm text-destructive">{data.error}</p>}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {latest.map((d) => (
            <DocCard key={d.path} doc={d} />
          ))}
        </div>
      </section>
    </>
  );
}
