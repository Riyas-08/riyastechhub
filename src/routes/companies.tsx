import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  ChevronRight,
  Code2,
  Cpu,
  FlaskConical,
  GitCompareArrows,
  GraduationCap,
  Search,
  Target,
  Wrench,
  X,
} from "lucide-react";

import { PcbBackground } from "@/components/pcb-background";
import { BRANCHES, COMPANIES, PREP_STAGES, ROLES, type BranchId, type Company } from "@/lib/companies-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/companies")({
  head: () => ({
    meta: [
      { title: "Core Company Explorer — RiyasTech Hub" },
      {
        name: "description",
        content:
          "Explore core engineering companies, required skills, tools, job roles and interview preparation for ECE, EEE, Mechanical, Civil and allied branches.",
      },
      { property: "og:title", content: "Core Company Explorer — RiyasTech Hub" },
      {
        property: "og:description",
        content:
          "A career intelligence platform for core engineering students: company skill requirements, role explorer and preparation roadmap.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: CompaniesPage,
});

function SkillBlock({ label, items, icon: Icon }: { label: string; items: string[]; icon: typeof Cpu }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-primary">
        <Icon className="h-3.5 w-3.5" /> {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.map((s) => (
          <span key={s} className="rounded-md border border-border bg-card px-2.5 py-1 text-[11px] font-medium">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function CompanyCard({
  company,
  selected,
  comparing,
  onSelect,
  onCompare,
}: {
  company: Company;
  selected: boolean;
  comparing: boolean;
  onSelect: () => void;
  onCompare: () => void;
}) {
  return (
    <article
      className={cn(
        "glass card-hover flex cursor-pointer flex-col p-5",
        selected && "border-primary/70 bg-primary/10 glow-ring"
      )}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-primary/40 bg-primary/10 text-primary">
          <Building2 className="h-5 w-5" />
        </span>
        <span
          className={cn(
            "rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-widest",
            company.difficulty === "Very High" && "bg-chart-5/20 text-chart-5",
            company.difficulty === "High" && "bg-chart-4/20 text-chart-4",
            company.difficulty === "Moderate" && "bg-chart-3/20 text-chart-3"
          )}
        >
          {company.difficulty}
        </span>
      </div>
      <h3 className="mt-3 font-display text-base font-bold">{company.name}</h3>
      <p className="text-xs font-medium text-primary">{company.industry}</p>
      <p className="mt-2 line-clamp-3 text-xs text-muted-foreground">{company.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {company.jobRoles.slice(0, 3).map((r) => (
          <span key={r} className="rounded-md border border-border bg-card px-2 py-0.5 text-[10px] font-medium">
            {r}
          </span>
        ))}
      </div>
      <div className="mt-auto flex items-center gap-2 pt-4">
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
          View skill profile <ChevronRight className="h-3.5 w-3.5" />
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCompare();
          }}
          className={cn(
            "ml-auto inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[10px] font-semibold transition-colors",
            comparing
              ? "border-primary bg-primary/15 text-primary"
              : "border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
          )}
        >
          <GitCompareArrows className="h-3 w-3" /> {comparing ? "Added" : "Compare"}
        </button>
      </div>
    </article>
  );
}

function CompaniesPage() {
  const [branch, setBranch] = useState<BranchId | "all">("all");
  const [domain, setDomain] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [roleId, setRoleId] = useState(ROLES[0]!.id);

  const domains = useMemo(() => {
    const set = new Set<string>();
    for (const c of COMPANIES) for (const d of c.domains) set.add(d);
    return [...set].sort();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COMPANIES.filter((c) => {
      if (branch !== "all" && !c.suitableBranches.includes(branch)) return false;
      if (domain !== "all" && !c.domains.includes(domain)) return false;
      if (
        q &&
        !`${c.name} ${c.industry} ${c.jobRoles.join(" ")} ${c.technicalSkills.join(" ")}`.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [branch, domain, query]);

  const selected = COMPANIES.find((c) => c.id === selectedId) ?? null;
  const compared = compareIds.map((id) => COMPANIES.find((c) => c.id === id)).filter((c): c is Company => Boolean(c));
  const activeRole = ROLES.find((r) => r.id === roleId) ?? ROLES[0]!;

  const toggleCompare = (id: string) =>
    setCompareIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev.slice(-2), id]));

  return (
    <>
      <PcbBackground />
      <main className="page-enter mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
        {/* ------------------------------ HERO ------------------------------ */}
        <section className="glass px-6 py-12 text-center sm:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Core Company Explorer</p>
          <h1 className="mx-auto mt-3 max-w-3xl font-display text-3xl font-bold sm:text-5xl">
            Career Intelligence for <span className="neon-text">Core Engineers</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Realistic skill requirements, tools, roles and interview topics for India's top core engineering companies.
          </p>
          <div className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search company, role or skill — e.g. Bosch, RTL, PLC..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
            />
            {query ? (
              <button onClick={() => setQuery("")} aria-label="Clear search">
                <X className="h-4 w-4 text-muted-foreground hover:text-primary" />
              </button>
            ) : null}
          </div>
        </section>

        {/* --------------------------- FILTERS ------------------------------ */}
        <section className="mt-10">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">Filter by Branch</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => setBranch("all")}
              className={cn(
                "rounded-lg border px-4 py-2 text-xs font-semibold transition-colors",
                branch === "all"
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-primary"
              )}
            >
              All Branches
            </button>
            {BRANCHES.map((b) => (
              <button
                key={b.id}
                onClick={() => setBranch(b.id)}
                className={cn(
                  "rounded-lg border px-4 py-2 text-xs font-semibold transition-colors",
                  branch === b.id
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-primary"
                )}
              >
                {b.short}
              </button>
            ))}
          </div>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-widest text-primary">Filter by Industry Domain</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => setDomain("all")}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                domain === "all"
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-primary"
              )}
            >
              All Domains
            </button>
            {domains.map((d) => (
              <button
                key={d}
                onClick={() => setDomain(d)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                  domain === d
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-primary"
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </section>

        {/* ------------------------- COMPANY GRID ---------------------------- */}
        <section className="mt-10">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Companies</h2>
            <p className="text-xs text-muted-foreground">{filtered.length} of {COMPANIES.length} shown</p>
          </div>
          {filtered.length === 0 ? (
            <div className="glass mt-6 p-10 text-center text-sm text-muted-foreground">
              No companies match this filter — try clearing the search or choosing another branch.
            </div>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c) => (
                <CompanyCard
                  key={c.id}
                  company={c}
                  selected={selectedId === c.id}
                  comparing={compareIds.includes(c.id)}
                  onSelect={() => setSelectedId(selectedId === c.id ? null : c.id)}
                  onCompare={() => toggleCompare(c.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* ---------------------- DETAILED SKILL PROFILE --------------------- */}
        {selected ? (
          <section className="mt-12">
            <div className="glass glow-ring p-6 sm:p-10">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Company Skill Profile</p>
                  <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{selected.name}</h2>
                  <p className="mt-1 text-sm font-medium text-primary">{selected.industry}</p>
                  <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{selected.description}</p>
                </div>
                <button
                  onClick={() => setSelectedId(null)}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
                  aria-label="Close profile"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <SkillBlock label="Core Subjects" items={selected.coreSubjects} icon={BookOpen} />
                <SkillBlock label="Programming" items={selected.programmingLanguages} icon={Code2} />
                <SkillBlock label="Technical Skills" items={selected.technicalSkills} icon={Cpu} />
                <SkillBlock label="Software Tools" items={selected.softwareTools} icon={Wrench} />
                <SkillBlock label="Hardware Skills" items={selected.hardwareSkills} icon={FlaskConical} />
                <SkillBlock label="Certifications" items={selected.certifications} icon={Award} />
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">Project Milestones</p>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2"><GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-chart-3" /><span><b className="text-foreground">Beginner:</b> {selected.projects.beginner}</span></li>
                    <li className="flex items-start gap-2"><GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-chart-4" /><span><b className="text-foreground">Intermediate:</b> {selected.projects.intermediate}</span></li>
                    <li className="flex items-start gap-2"><GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-chart-5" /><span><b className="text-foreground">Advanced:</b> {selected.projects.advanced}</span></li>
                  </ul>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">Interview Focus</p>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {selected.interviewTopics.map((t) => (
                      <li key={t} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">Open Roles</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selected.jobRoles.map((r) => (
                    <span key={r} className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* --------------------------- COMPARISON ---------------------------- */}
        {compared.length > 0 ? (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Company Comparison</h2>
            <p className="mt-2 text-sm text-muted-foreground">Compare skill expectations side by side (up to 3 companies).</p>
            <div className={cn("mt-6 grid gap-5", compared.length === 1 ? "sm:grid-cols-1" : compared.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3")}>
              {compared.map((c) => (
                <article key={c.id} className="glass card-hover p-6">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-lg font-bold">{c.name}</h3>
                    <button onClick={() => toggleCompare(c.id)} aria-label={`Remove ${c.name} from comparison`}>
                      <X className="h-4 w-4 text-muted-foreground hover:text-primary" />
                    </button>
                  </div>
                  <p className="text-xs font-medium text-primary">{c.industry}</p>
                  <p className="mt-2 text-xs text-muted-foreground">Difficulty: {c.difficulty}</p>
                  <div className="mt-4 space-y-4">
                    <SkillBlock label="Must-have Skills" items={c.technicalSkills} icon={Cpu} />
                    <SkillBlock label="Tools" items={c.softwareTools} icon={Wrench} />
                    <SkillBlock label="Programming" items={c.programmingLanguages} icon={Code2} />
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {/* --------------------------- ROLE EXPLORER ------------------------- */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Role Explorer</h2>
          <p className="mt-2 text-sm text-muted-foreground">Pick a job role to see the skills, tools, projects and learning path it demands.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => setRoleId(r.id)}
                className={cn(
                  "rounded-lg border px-4 py-2 text-xs font-semibold transition-colors",
                  roleId === r.id
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-primary"
                )}
              >
                {r.name}
              </button>
            ))}
          </div>
          <div className="glass mt-6 p-6 sm:p-8">
            <h3 className="font-display text-xl font-bold sm:text-2xl">{activeRole.name}</h3>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{activeRole.about}</p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <SkillBlock label="Key Skills" items={activeRole.skills} icon={Cpu} />
              <SkillBlock label="Tools" items={activeRole.tools} icon={Wrench} />
              <SkillBlock label="Hiring Companies" items={activeRole.companies} icon={Building2} />
              <SkillBlock label="Portfolio Projects" items={activeRole.projects} icon={GraduationCap} />
            </div>
            <div className="mt-8">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">Learning Path</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {activeRole.learningPath.map((step, i) => (
                  <span key={step} className="contents">
                    {i > 0 ? <ChevronRight className="h-4 w-4 text-primary" /> : null}
                    <span className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium">{step}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------- PREPARATION TIMELINE -------------------- */}
        <section className="mt-14 mb-4">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Preparation Timeline</h2>
          <p className="mt-2 text-sm text-muted-foreground">Four stages from fundamentals to company-ready.</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PREP_STAGES.map((s, i) => (
              <article key={s.stage} className="glass card-hover p-6">
                <span className="glow-ring grid h-9 w-9 place-items-center rounded-full border border-primary/50 bg-background font-display text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">{s.stage}</p>
                <h3 className="mt-1 font-display text-lg font-bold">{s.title}</h3>
                <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
