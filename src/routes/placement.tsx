import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowDown,
  Building2,
  CheckCircle2,
  Cpu,
  Factory,
  HeartPulse,
  Landmark,
  Plane,
  Radio,
  Car,
  Bot,
  Wrench,
  Gauge,
  Target,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

import { PcbBackground } from "@/components/pcb-background";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/placement")({
  head: () => ({
    meta: [
      { title: "Placement Roadmap — RiyasTech Hub" },
      {
        name: "description",
        content:
          "Core engineering placement roadmap: companies, skills, career paths and year-wise preparation for ECE, EEE, Mechanical, Civil and more.",
      },
      { property: "og:title", content: "Core Engineering Placement Roadmap — RiyasTech Hub" },
      {
        property: "og:description",
        content:
          "Discover core companies, required skills, career paths and a complete year-wise preparation roadmap.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PlacementPage,
});

import {
  CAREER_PATHS,
  CHECKLIST_ITEMS,
  COMPANIES,
  INTERVIEW_PREP,
  PROJECTS,
  ROADMAP,
  SKILL_CATEGORIES,
  TIER_MAP,
  type BranchId,
} from "@/lib/placement-data";

const BRANCHES: { id: BranchId; name: string; icon: LucideIcon }[] = [
  { id: "ece", name: "ECE", icon: Cpu },
  { id: "eee", name: "EEE", icon: Gauge },
  { id: "mech", name: "Mechanical Engineering", icon: Wrench },
  { id: "civil", name: "Civil Engineering", icon: Landmark },
  { id: "robotics", name: "Robotics & Automation", icon: Bot },
  { id: "mechatronics", name: "Mechatronics", icon: Factory },
  { id: "automobile", name: "Automobile Engineering", icon: Car },
  { id: "instrumentation", name: "Instrumentation Engineering", icon: Radio },
  { id: "biomedical", name: "Biomedical Engineering", icon: HeartPulse },
  { id: "aerospace", name: "Aerospace Engineering", icon: Plane },
];

/* -------------------------------- component ------------------------------- */

function PlacementPage() {
  const [branch, setBranch] = useState<BranchId>("ece");
  const [activePath, setActivePath] = useState(0);
  const [checked, setChecked] = useState<boolean[]>(() => CHECKLIST_ITEMS.map(() => false));
  const [skillsOpen, setSkillsOpen] = useState<number | null>(null);

  const categories = useMemo(() => COMPANIES[branch], [branch]);
  const readiness = Math.round((checked.filter(Boolean).length / CHECKLIST_ITEMS.length) * 100);
  const activeCareer = CAREER_PATHS[activePath] ?? CAREER_PATHS[0]!;

  return (
    <>
      <PcbBackground />
      <main className="page-enter mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
        {/* ------------------------------ HERO ------------------------------ */}
        <section className="glass relative overflow-hidden px-6 py-12 text-center sm:px-12">
          <div className="pointer-events-none absolute inset-0 opacity-30">
            <Bot className="node-pulse absolute left-6 top-8 h-10 w-10 text-primary" />
            <Cpu className="node-pulse absolute right-8 top-14 h-8 w-8 text-primary" style={{ animationDelay: "1s" }} />
            <Wrench className="node-pulse absolute bottom-8 left-12 h-8 w-8 text-primary" style={{ animationDelay: "2s" }} />
            <Radio className="node-pulse absolute bottom-10 right-10 h-9 w-9 text-primary" style={{ animationDelay: "0.5s" }} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Core Engineering Placement Roadmap</p>
          <h1 className="mx-auto mt-3 max-w-3xl font-display text-3xl font-bold sm:text-5xl">
            Your Roadmap to <span className="neon-text">Core Engineering Placement</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Discover Core Companies, Required Skills, Career Paths and a Complete Year-wise Preparation Roadmap.
          </p>
          <a
            href="#roadmap"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
          >
            Explore Your Roadmap <ChevronRight className="h-4 w-4" />
          </a>
        </section>

        {/* ------------------------- SECTION 1: BRANCH ------------------------ */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Select Your Branch</h2>
          <p className="mt-2 text-sm text-muted-foreground">Choose your engineering branch to see matching core companies and skills.</p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {BRANCHES.map((b) => {
              const Icon = b.icon;
              const active = branch === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => setBranch(b.id)}
                  className={cn(
                    "glass card-hover flex flex-col items-center gap-2 px-3 py-5 text-center",
                    active && "border-primary/70 bg-primary/10 glow-ring"
                  )}
                >
                  <Icon className={cn("h-7 w-7", active ? "text-primary" : "text-muted-foreground")} />
                  <span className={cn("text-xs font-semibold sm:text-sm", active && "text-primary")}>{b.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ------------------------ SECTION 2: COMPANIES ---------------------- */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Top Core Companies Tier List</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Major multinational and national core companies hiring {BRANCHES.find((b) => b.id === branch)?.name} students, grouped by industry category and tier.
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {categories.map((cat, i) => (
              <article key={cat.category} className="glass card-hover p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-primary/40 bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-lg font-bold">{cat.category}</h3>
                  <span className="ml-auto shrink-0 rounded-md border border-primary/40 bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                    {TIER_MAP[cat.category] ?? "Core"}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {cat.companies.map((c) => (
                    <span key={c} className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium">
                      {c}
                    </span>
                  ))}
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">Available Roles</p>
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                      {cat.roles.map((r) => (
                        <li key={r}>• {r}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">Required Skills</p>
                    {skillsOpen === i ? (
                      <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                        {cat.skills.map((s) => (
                          <li key={s}>• {s}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-xs text-muted-foreground">{cat.skills.length} core skills required</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSkillsOpen(skillsOpen === i ? null : i)}
                  className="mt-5 inline-flex items-center gap-1 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                >
                  View Required Skills <ChevronRight className={cn("h-3.5 w-3.5 transition-transform", skillsOpen === i && "rotate-90")} />
                </button>
              </article>
            ))}
          </div>
        </section>

        {/* ------------------------- SECTION 3: SKILLS ------------------------ */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">What Skills Do Core Companies Expect?</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SKILL_CATEGORIES.map((cat) => (
              <article key={cat.title} className="glass card-hover p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{cat.title}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {cat.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary/60 hover:text-primary"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* --------------------- SECTION 4: YEAR ROADMAP ---------------------- */}
        <section id="roadmap" className="mt-14 scroll-mt-24">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Year-wise Placement Roadmap</h2>
          <p className="mt-2 text-sm text-muted-foreground">A four-year plan, connected as a single timeline from foundation to placement.</p>
          <div className="relative mt-8 space-y-8">
            <div className="absolute bottom-8 left-6 top-8 hidden w-px bg-gradient-to-b from-primary via-secondary to-primary sm:block" />
            {ROADMAP.map((stage, idx) => (
              <article key={stage.year} className="relative sm:pl-20">
                <span className="glow-ring absolute left-0 top-1 hidden h-12 w-12 place-items-center rounded-full border border-primary/50 bg-background font-display text-sm font-bold text-primary sm:grid">
                  {idx + 1}
                </span>
                <div className="glass card-hover p-6 sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">{stage.year}</p>
                  <h3 className="mt-1 font-display text-xl font-bold sm:text-2xl">{stage.title}</h3>
                  <div className="mt-5 grid gap-6 lg:grid-cols-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">Focus</p>
                      <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                        {stage.focus.map((f) => (
                          <li key={f}>• {f}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">Learn</p>
                      <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                        {stage.learn.map((l) => (
                          <li key={l}>• {l}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">Activities</p>
                      <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                        {stage.activities.map((a) => (
                          <li key={a} className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
                      Project &amp; Portfolio Milestones
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {stage.projects.map((p) => (
                        <span key={p} className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="mt-6 inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
                    <Target className="h-3.5 w-3.5" /> Goal: "{stage.goal}"
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ---------------------- SECTION 5: CAREER PATHS --------------------- */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Career Path Explorer</h2>
          <p className="mt-2 text-sm text-muted-foreground">Pick a domain to see its skill progression, from first course to placement.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {CAREER_PATHS.map((p, i) => (
              <button
                key={p.domain}
                onClick={() => setActivePath(i)}
                className={cn(
                  "rounded-lg border px-4 py-2 text-xs font-semibold transition-colors",
                  activePath === i
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-primary"
                )}
              >
                {p.domain}
              </button>
            ))}
          </div>
          <div className="glass mt-6 p-6 sm:p-8">
            <div className="flex flex-col items-center gap-0 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-2">
              <span className="rounded-xl border border-primary/50 bg-primary/10 px-4 py-2 font-display text-xs font-bold text-primary sm:text-sm">
                {BRANCHES.find((b) => b.id === branch)?.name} Student
              </span>
              <span className="py-1 text-primary sm:hidden"><ArrowDown className="h-4 w-4" /></span>
              <span className="hidden text-primary sm:block"><ChevronRight className="h-4 w-4" /></span>
              <span className="rounded-xl border border-secondary/60 bg-secondary/10 px-4 py-2 font-display text-xs font-bold text-secondary-foreground sm:text-sm">
                {activeCareer.domain}
              </span>
              {activeCareer.steps.map((step) => (
                <span key={step} className="contents">
                  <span className="py-1 text-primary sm:hidden"><ArrowDown className="h-4 w-4" /></span>
                  <span className="hidden text-primary sm:block"><ChevronRight className="h-4 w-4" /></span>
                  <span className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium">{step}</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------ SECTION 6: PROJECTS ----------------------- */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Projects That Strengthen Your Resume</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((p) => (
              <article key={p.name} className="glass card-hover p-6">
                <span
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest",
                    p.level === "Beginner" && "bg-chart-3/20 text-chart-3",
                    p.level === "Intermediate" && "bg-chart-4/20 text-chart-4",
                    p.level === "Advanced" && "bg-chart-5/20 text-chart-5"
                  )}
                >
                  {p.level}
                </span>
                <h3 className="mt-3 font-display text-lg font-bold">{p.name}</h3>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-primary">Skills Used</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.skills.map((s) => (
                    <span key={s} className="rounded-md border border-border bg-card px-2 py-1 text-[11px] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Industry relevance:</span> {p.relevance}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* ------------------- SECTION 7: INTERVIEW STRATEGY ------------------ */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Interview Preparation Strategy</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            What core-sector recruiters test — technical depth, problem solving and HR expectations.
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {INTERVIEW_PREP.map((block) => (
              <article key={block.title} className="glass card-hover p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{block.title}</p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {block.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* ----------------------- SECTION 8: CHECKLIST ----------------------- */}
        <section className="mt-14 mb-4">
          <div className="glass p-6 sm:p-10">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Are You Placement Ready?</h2>
            <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_260px]">
              <ul className="grid gap-3 sm:grid-cols-2">
                {CHECKLIST_ITEMS.map((item, i) => (
                  <li key={item}>
                    <button
                      onClick={() =>
                        setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
                      }
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                        checked[i]
                          ? "border-primary/60 bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40"
                      )}
                    >
                      <span
                        className={cn(
                          "grid h-5 w-5 shrink-0 place-items-center rounded-md border",
                          checked[i] ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"
                        )}
                      >
                        {checked[i] ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
                      </span>
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Placement Readiness</p>
                <p className="mt-2 font-display text-5xl font-bold neon-text">{readiness}%</p>
                <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${readiness}%`, backgroundImage: "var(--gradient-neon)" }}
                  />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {readiness === 100
                    ? "Outstanding — you're ready for core company interviews!"
                    : readiness >= 70
                      ? "Great progress — close the remaining gaps."
                      : "Keep going — tick each milestone as you complete it."}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
