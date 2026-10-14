import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import {
  CAREER_PATHS, CHECKLIST_ITEMS, COMPANIES, INTERVIEW_PREP, PLACEMENT_BRANCHES,
  PROJECTS, ROADMAP, SKILL_CATEGORIES, TIER_MAP, type BranchId,
} from "@/lib/placement-data";

const json = (value: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] });
const hints = { readOnlyHint: true, idempotentHint: true, openWorldHint: false };

export const getPlacementGuide = defineTool({
  name: "get_placement_guide",
  title: "Get Placement page guide",
  description:
    "Read the Placement page: core companies by industry (with tier, job roles and skills) for a branch, plus the 4-year roadmap, interview preparation strategy, skill categories, career paths, resume projects and readiness checklist. Omit branch to list branches.",
  inputSchema: { branch: z.string().optional().describe("Branch id, e.g. 'ece', 'eee', 'mech', 'civil'.") },
  annotations: hints,
  handler: ({ branch }) => {
    if (!branch) return json({ branches: PLACEMENT_BRANCHES });
    const id = branch.toLowerCase() as BranchId;
    const industries = COMPANIES[id];
    if (!industries) throw new ToolError(`Unknown branch '${branch}'. Valid: ${PLACEMENT_BRANCHES.map((b) => b.id).join(", ")}`);
    return json({
      branch: PLACEMENT_BRANCHES.find((b) => b.id === id),
      industries: industries.map((c) => ({ ...c, tier: TIER_MAP[c.category] ?? null })),
      fourYearRoadmap: ROADMAP,
      interviewPrep: INTERVIEW_PREP,
      skillCategories: SKILL_CATEGORIES,
      careerPaths: CAREER_PATHS,
      resumeProjects: PROJECTS,
      readinessChecklist: CHECKLIST_ITEMS,
    });
  },
});
