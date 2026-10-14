import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, CheckCircle2, Circle, Target, TriangleAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { PageShell } from "@/components/site-shell";
import { COMPANIES, ROLES } from "@/lib/companies-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/readiness")({
  head: () => ({
    meta: [
      { title: "Placement Readiness Analyzer — RiyasTech Hub" },
      {
        name: "description",
        content:
          "Pick target core companies or job roles, tick your skills, tools and projects, and get a readiness score, skill gaps and a 30-day prep plan.",
      },
      { property: "og:title", content: "Placement Readiness Analyzer — RiyasTech Hub" },
      {
        property: "og:description",
        content: "Your interview readiness score for Bosch, Qualcomm, Siemens, Intel and more, with a 30-day plan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReadinessPage,
});

type Kind = "Skill" | "Tool" | "Project";
type Req = { key: string; label: string; kind: Kind; weight: number };
const STORE = "riyastech-readiness-v1";

function buildRequirements(companyIds: string[], roleIds: string[]): Req[] {
  const map = new Map<string, Req>();
  const add = (label: string, kind: Kind, weight: number) => {
    const key = `${kind}:${label.toLowerCase()}`;
    const cur = map.get(key);
    if (cur) cur.weight += weight;
    else map.set(key, { key, label, kind, weight });
  };
  for (const c of COMPANIES.filter((x) => companyIds.includes(x.id))) {
    [...c.technicalSkills, ...c.programmingLanguages].forEach((s) => add(s, "Skill", 2));
    c.coreSubjects.forEach((s) => add(s, "Skill", 1));
    c.softwareTools.forEach((s) => add(s, "Tool", 1));
    Object.values(c.projects).forEach((p) => add(p, "Project", 2));
  }
  for (const r of ROLES.filter((x) => roleIds.includes(x.id))) {
    r.skills.forEach((s) => add(s, "Skill", 2));
    r.tools.forEach((s) => add(s, "Tool", 1));
    r.projects.forEach((p) => add(p, "Project", 2));
  }
  return [...map.values()].sort((a, b) => b.weight - a.weight);
}

function buildPlan(gaps: Req[]) {
  const weeks = [
    { title: "Week 1 · Core fundamentals", kinds: ["Skill"] as Kind[] },
    { title: "Week 2 · Tools hands-on", kinds: ["Tool", "Skill"] as Kind[] },
    { title: "Week 3 · Build projects", kinds: ["Project"] as Kind[] },
    { title: "Week 4 · Interview & revision", kinds: [] as Kind[] },
  ];
  const skills = gaps.filter((g) => g.kind === "Skill");
  const tools = gaps.filter((g) => g.kind === "Tool");
  const projects = gaps.filter((g) => g.kind === "Project");
  const days: { day: number; task: string }[] = [];
  const pick = (list: Req[], i: number) => list[i % Math.max(list.length, 1)];
  for (let d = 1; d <= 30; d++) {
    let task: string;
    if (d <= 7) {
      const s = pick(skills, d - 1);
      task = s ? `Study ${s.label}: notes + 10 practice questions` : "Revise core subjects and solve 10 aptitude questions";
    } else if (d <= 14) {
      const t = pick(tools.length ? tools : skills, d - 8);
      task = t ? `Hands-on with ${t.label}: complete one guided exercise` : "Practice a tool you already know with a new exercise";
    } else if (d <= 22) {
      const p = pick(projects, Math.floor((d - 15) / 2));
      task = p
        ? `${d % 2 ? "Build" : "Test & document"}: ${p.label}`
        : "Improve an existing project and push it to GitHub";
    } else if (d <= 27) {
      task = [
        "Update resume with new skills and projects",
        "Mock technical interview on core subjects",
        "Solve 3 C/C++/Python placement problems",
        "Prepare HR answers: strengths, projects, why this company",
        "Aptitude test + review mistakes",
      ][d - 23]!;
    } else {
      task = ["Revise weak topics from the gap list", "Full mock interview (technical + HR)", "Final revision and rest before applying"][d - 28]!;
    }
    days.push({ day: d, task });
  }
  return weeks.map((w, i) => ({ title: w.title, days: days.slice([0, 7, 14, 22][i], [7, 14, 22, 30][i]) }));
}

function ReadinessPage() {
  const [companies, setCompanies] = useState<string[]>(["bosch"]);
  const [roles, setRoles] = useState<string[]>([]);
  const [have, setHave] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(STORE) ?? "null");
      if (s) {
        setCompanies(s.companies ?? []);
        setRoles(s.roles ?? []);
        setHave(s.have ?? []);
      }
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORE, JSON.stringify({ companies, roles, have }));
  }, [companies, roles, have, loaded]);

  const reqs = useMemo(() => buildRequirements(companies, roles), [companies, roles]);
  const total = reqs.reduce((s, r) => s + r.weight, 0);
  const got = reqs.filter((r) => have.includes(r.key)).reduce((s, r) => s + r.weight, 0);
  const score = total ? Math.round((got / total) * 100) : 0;
  const gaps = reqs.filter((r) => !have.includes(r.key));
  const plan = useMemo(() => buildPlan(gaps), [gaps]);

  const toggle = (list: string[], set: (v: string[]) => void, id: string) =>
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  const verdict =
    score >= 80 ? "Interview ready" : score >= 55 ? "Almost there" : score >= 30 ? "Building up" : "Just starting";

  return (
    <PageShell
      eyebrow="Placement"
      title="Placement Readiness Analyzer"
      description="Choose your target companies or job roles, tick what you already know, and get your match score, skill gaps and a 30-day plan."
    >
      <div className="grid gap-6">
        <section className="glass p-5 sm:p-6">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <Target className="h-5 w-5 text-primary" /> 1. Target companies
          </h2>
          <div className="flex flex-wrap gap-2">
            {COMPANIES.map((c) => (
              <button
                key={c.id}
                onClick={() => toggle(companies, setCompanies, c.id)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition",
                  companies.includes(c.id)
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50",
                )}
              >
                {c.name}
              </button>
            ))}
          </div>
          <h2 className="mb-3 mt-6 text-lg font-semibold">…or target job roles</h2>
          <div className="flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => toggle(roles, setRoles, r.id)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition",
                  roles.includes(r.id)
                    ? "border-accent bg-accent/15 text-accent-foreground"
                    : "border-border text-muted-foreground hover:border-accent/50",
                )}
              >
                {r.name}
              </button>
            ))}
          </div>
        </section>

        {reqs.length === 0 ? (
          <p className="glass p-6 text-center text-muted-foreground">Select at least one company or role to begin.</p>
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <section className="glass p-5 sm:p-6">
                <h2 className="mb-3 text-lg font-semibold">2. Tick what you already have</h2>
                {(["Skill", "Tool", "Project"] as Kind[]).map((k) => (
                  <div key={k} className="mb-5">
                    <h3 className="mb-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                      {k === "Project" ? "Project milestones" : `${k}s`}
                    </h3>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {reqs
                        .filter((r) => r.kind === k)
                        .map((r) => {
                          const on = have.includes(r.key);
                          return (
                            <label
                              key={r.key}
                              className={cn(
                                "flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 text-sm",
                                on ? "border-primary/50 bg-primary/10" : "border-border",
                              )}
                            >
                              <input
                                type="checkbox"
                                className="mt-0.5 accent-[var(--color-primary)]"
                                checked={on}
                                onChange={() => toggle(have, setHave, r.key)}
                              />
                              <span>{r.label}</span>
                            </label>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </section>

              <aside className="glass h-fit p-5 sm:p-6 lg:sticky lg:top-24">
                <h2 className="text-lg font-semibold">3. Your match score</h2>
                <p className="mt-3 text-5xl font-bold text-primary">{score}%</p>
                <p className="text-sm text-muted-foreground">{verdict}</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full" style={{ width: `${score}%`, backgroundImage: "var(--gradient-neon)" }} />
                </div>
                <h3 className="mt-5 flex items-center gap-2 text-sm font-semibold">
                  <TriangleAlert className="h-4 w-4 text-destructive" /> Top skill gaps
                </h3>
                <ul className="mt-2 grid gap-1 text-sm">
                  {gaps.slice(0, 8).map((g) => (
                    <li key={g.key} className="flex items-start gap-2">
                      <Circle className="mt-1 h-3 w-3 shrink-0 text-destructive" />
                      <span>
                        {g.label} <span className="text-xs text-muted-foreground">({g.kind})</span>
                      </span>
                    </li>
                  ))}
                  {gaps.length === 0 ? (
                    <li className="flex items-center gap-2 text-primary">
                      <CheckCircle2 className="h-4 w-4" /> No gaps — start applying!
                    </li>
                  ) : null}
                </ul>
              </aside>
            </div>

            <section className="glass p-5 sm:p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <CalendarCheck className="h-5 w-5 text-primary" /> 4. Your 30-day preparation checklist
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {plan.map((w) => (
                  <div key={w.title} className="rounded-xl border border-border p-4">
                    <h3 className="mb-2 font-medium text-primary">{w.title}</h3>
                    <ol className="grid gap-1.5 text-sm">
                      {w.days.map((d) => (
                        <li key={d.day} className="flex gap-2">
                          <span className="w-12 shrink-0 text-muted-foreground">Day {d.day}</span>
                          <span>{d.task}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </PageShell>
  );
}
