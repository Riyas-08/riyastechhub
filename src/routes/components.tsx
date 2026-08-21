import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronDown, ExternalLink, PackageSearch } from "lucide-react";
import { useMemo, useState } from "react";

import { PageShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { useHydrated, useProject } from "@/lib/session";
import { VENDORS, vendorPrice } from "@/lib/vendors";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/components")({
  head: () => ({
    meta: [
      { title: "Components & Ordering — RiyasTech Hub" },
      {
        name: "description",
        content:
          "Compare component prices across Robu.in, Amazon.in, Evelta and more Indian electronics stores, then order in one click.",
      },
      { property: "og:title", content: "Components & Ordering — RiyasTech Hub" },
      { property: "og:description", content: "Price comparison across Indian electronics stores." },
    ],
  }),
  component: ComponentsPage,
});

function ComponentsPage() {
  const project = useProject();
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const components = project?.components ?? [];
  const total = useMemo(
    () =>
      components
        .filter((c) => selected[c.name])
        .reduce(
          (sum, c) => sum + c.estimatedPriceInr * (parseInt(c.quantity, 10) || 1),
          0,
        ),
    [components, selected],
  );

  if (hydrated && !project) {
    return (
      <PageShell eyebrow="Step 5 of 10" title="Component Selection & Ordering">
        <div className="glass p-6">
          <p className="text-sm text-muted-foreground">
            No analysed project yet. Run the analysis engine to build your hardware list.
          </p>
          <Button className="mt-4" onClick={() => navigate({ to: "/analyze" })}>
            <PackageSearch className="h-4 w-4" /> Analyse a project
          </Button>
        </div>
      </PageShell>
    );
  }

  const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <PageShell
      eyebrow="Step 5 of 10"
      title="Component Selection & Ordering"
      description={project?.title ?? "Your generated hardware list"}
    >
      {/* Overview list — scroll down for each component in detail */}
      <section className="glass p-5">
        <h2 className="font-display text-lg font-semibold">Your component list</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {components.length} parts generated. Scroll down to view each component one by one with
          its stores and direct buying links.
        </p>
        <ol className="mt-4 grid gap-2 sm:grid-cols-2">
          {components.map((c, i) => (
            <li key={c.name}>
              <a
                href={`#${slug(c.name)}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:border-primary/60 hover:text-primary"
              >
                <span className="min-w-0 truncate">
                  {i + 1}. {c.name}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">₹{c.estimatedPriceInr}</span>
              </a>
            </li>
          ))}
        </ol>
        <p className="mt-4 flex items-center gap-2 text-xs uppercase tracking-widest text-primary">
          <ChevronDown className="h-4 w-4 animate-bounce" /> Scroll to explore each component
        </p>
      </section>

      <div className="mt-8 space-y-10">
        {components.map((c, i) => {
          const isOn = !!selected[c.name];
          return (
            <article
              key={c.name}
              id={slug(c.name)}
              className={cn(
                "glass card-hover scroll-mt-24 p-5 sm:p-7",
                isOn && "border-primary/60",
              )}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                Component {i + 1} of {components.length}
              </p>
              <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                <div className="min-w-0">
                  <h2 className="font-display text-lg font-semibold sm:text-2xl">{c.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{c.role}</p>
                  <p className="mt-2 text-xs uppercase tracking-widest text-primary">
                    {c.category} · Qty {c.quantity} · ≈ ₹{c.estimatedPriceInr}
                  </p>
                  {c.specification ? (
                    <p className="mt-2 text-xs text-muted-foreground">{c.specification}</p>
                  ) : null}
                </div>
                <Button
                  size="sm"
                  variant={isOn ? "default" : "outline"}
                  className="shrink-0"
                  onClick={() => setSelected((s) => ({ ...s, [c.name]: !s[c.name] }))}
                >
                  {isOn ? "Selected" : "Select"}
                </Button>
              </div>

              <div className="mt-5 border-t border-border pt-5">
                <h3 className="text-sm font-semibold">Where to buy this component</h3>
                <div className="mt-3 space-y-2">
                  {VENDORS.map((store) => (
                    <a
                      key={store.id}
                      href={store.search(c.searchQuery || c.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-3 text-sm transition-colors hover:border-primary/60 hover:text-primary"
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{store.name}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {store.note}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                        ≈ ₹{vendorPrice(c.estimatedPriceInr, store.factor)}
                        <ExternalLink className="h-3 w-3" />
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="glass sticky bottom-4 mt-6 flex flex-wrap items-center justify-between gap-3 p-5">
        <p className="text-sm text-muted-foreground">
          Estimated cost of selected components
        </p>
        <p className="font-display text-2xl font-bold text-primary">₹{total.toLocaleString("en-IN")}</p>
      </div>

      <Button variant="outline" className="mt-6" onClick={() => navigate({ to: "/guide" })}>
        Continue to Component Guide
      </Button>
    </PageShell>
  );
}