import { Link } from "@tanstack/react-router";
import { CircuitBoard, Menu } from "lucide-react";
import { useState, type ReactNode } from "react";

import { PcbBackground } from "./pcb-background";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/enter", label: "Sign In" },
  { to: "/profile", label: "Profile" },
  { to: "/analyze", label: "Analyze" },
  { to: "/components", label: "Components" },
  { to: "/referrals", label: "Refer & Earn" },
  { to: "/guide", label: "Guide & Viva" },
  { to: "/placement", label: "Placement" },
  { to: "/riya", label: "Riya AI" },
  { to: "/about", label: "Owner" },
  { to: "/connect", label: "Learn & Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 lg:flex lg:justify-between">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-primary/40 bg-primary/10 text-primary">
            <CircuitBoard className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-base font-bold neon-text">
              RiyasTech Hub
            </span>
            <span className="block truncate text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Kumaraguru College of Technology
            </span>
          </span>
        </Link>

        <nav className="hidden flex-wrap items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              activeProps={{ className: "bg-primary/15 text-primary" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border text-primary lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open ? (
        <nav className="grid grid-cols-2 gap-1 border-t border-border/60 px-4 py-3 sm:grid-cols-3 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              activeProps={{ className: "bg-primary/15 text-primary" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
      <p>RiyasTech Hub — built by Riyas U, ECE, Kumaraguru College of Technology</p>
      <p className="mt-1">riyasusman2008@gmail.com</p>
    </footer>
  );
}

export function PageShell({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <>
      <PcbBackground />
      <main className={cn("page-enter mx-auto w-full max-w-6xl px-4 py-10 sm:py-14", className)}>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">{eyebrow}</p>
        <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{title}</h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">{description}</p>
        ) : null}
        <div className="mt-8">{children}</div>
      </main>
    </>
  );
}
