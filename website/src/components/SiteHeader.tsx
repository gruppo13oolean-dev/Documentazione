"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github } from "lucide-react";
import { repoUrl, site } from "@/lib/site";

export function Logo() {
  return (
    <span className="inline-flex items-center font-display">
      <Image
        src="/cropped-logo.png"
        alt={site.name}
        width={36}
        height={40}
        className="h-9 w-auto object-contain"
        priority
      />
    </span>
  );
}

const nav = [
  { to: "/", label: "Home" },
  { to: "/documenti", label: "Documenti" },
  { to: "/membri", label: "Membri" },
] as const;

export function SiteHeader() {
  const pathname = usePathname() ?? "/";

  return (
    <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" aria-label={site.name}>
          <Logo />
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium">
          {nav.map((n) => {
            const isActive = n.to === "/" ? pathname === "/" : pathname === n.to || pathname.startsWith(n.to + "/");
            return (
              <Link
                key={n.to}
                href={n.to}
                data-status={isActive ? "active" : undefined}
                className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-primary"
              >
                {n.label}
              </Link>
            );
          })}
          <a href={repoUrl} target="_blank" rel="noreferrer" aria-label="GitHub" className="ml-1 rounded-md p-2 text-muted-foreground hover:text-foreground">
            <Github className="h-5 w-5" />
          </a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <span>© {site.name} · {site.university}</span>
        <span>{site.course} · {site.year}</span>
      </div>
    </footer>
  );
}
