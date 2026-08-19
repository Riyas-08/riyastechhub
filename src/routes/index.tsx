import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  Cpu,
  Gift,
  GraduationCap,
  ScanSearch,
  ShoppingCart,
} from "lucide-react";

import { PcbBackground } from "@/components/pcb-background";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RiyasTech Hub — AI Hardware Project Platform" },
      {
        name: "description",
        content:
          "Enter RiyasTech Hub: AI-generated hardware lists, live vendor price comparison, viva question banks and Riya AI for electronics students.",
      },
      { property: "og:title", content: "RiyasTech Hub — AI Hardware Project Platform" },
      {
        property: "og:description",
        content: "Build hardware projects faster with AI component analysis and vendor pricing.",
      },
    ],
  }),
  component: Index,
});

const HIGHLIGHTS = [
  { icon: ScanSearch, title: "Project Analysis Engine", text: "English, Tamil or Tanglish in — a full, part-number-level hardware list out." },
  { icon: ShoppingCart, title: "Multi-Store Ordering", text: "Compare Robu, Amazon, Evelta, Probots, ThinkRobotics and ElectronicsComp side by side." },
  { icon: GraduationCap, title: "Viva Question Bank", text: "Hundreds of project-specific questions with detailed model answers." },
  { icon: Bot, title: "Riya AI Assistant", text: "A hardware-only expert for circuits, ICs, firmware and debugging." },
  { icon: Gift, title: "Real Refer & Earn", text: "Credits are awarded only when a genuine new member signs up with your link." },
  { icon: Cpu, title: "Component Guide", text: "Specifications and circuit roles for every part your build needs." },
];

function Index() {
  return (
    <>
      <PcbBackground dense />
      <main className="page-enter mx-auto w-full max-w-6xl px-4 pb-16 pt-14 sm:pt-20">
        <section className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            Hardware Intelligence Platform
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight sm:text-6xl">
            <span className="neon-text">RiyasTech Hub</span>
          </h1>
          <p className="mt-3 text-sm uppercase tracking-[0.24em] text-muted-foreground sm:text-base">
            Kumaraguru College of Technology
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Describe any electronics or robotics project in English, Tamil or Tanglish. Get the exact
            components, live store links, price comparison, a component guide and viva preparation —
            all in one glowing workspace.
          </p>
          <div className="mt-9 flex justify-center">
            <Link
              to="/enter"
              className="group inline-flex items-center gap-2 rounded-xl px-7 py-3.5 font-semibold text-neon-foreground glow-ring transition-transform hover:-translate-y-0.5"
              style={{ backgroundImage: "var(--gradient-neon)" }}
            >
              Enter Platform
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

        <section className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
            <article key={title} className="glass card-hover p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
