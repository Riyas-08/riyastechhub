import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ExternalLink, PackageSearch } from "lucide-react";
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

  return (
    <PageShell
      eyebrow="Step 5 of 10"
      title="Component Selection & Ordering"
      description={project?.title ?? "Your generated hardware list"}
    >
      <div className="space-y-4">
        {components.map((c) => {
          const isOn = !!selected[c.name];
          return (
            <article
              key={c.name}
              className={cn("glass card-hover p-5", isOn && "border-primary/60")}
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                <div className="min-w-0">
                  <h2 className="truncate font-display text-base font-semibold sm:text-lg">
                    {c.name}
                  </h2>
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

              <div className="mt-4 grid gap-2 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-3">
                {VENDORS.map((store) => (
                  <a
                    key={store.id}
                    href={store.search(c.searchQuery || c.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={store.note}
                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:border-primary/60 hover:text-primary"
                  >
                    <span className="min-w-0 truncate">{store.name}</span>
                    <span className="ml-2 flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                      ≈ ₹{vendorPrice(c.estimatedPriceInr, store.factor)}
                      <ExternalLink className="h-3 w-3" />
                    </span>
                  </a>
                ))}
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