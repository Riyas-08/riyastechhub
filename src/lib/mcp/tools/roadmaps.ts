import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { DEPARTMENTS, findDepartment, searchRoadmaps } from "@/lib/department-roadmaps";
import { PREP_STAGES } from "@/lib/companies-data";

const json = (value: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] });
const hints = { readOnlyHint: true, idempotentHint: true, openWorldHint: false };

export const listDepartments = defineTool({
  name: "list_departments",
  title: "List engineering departments",
  description: "List every engineering department that has a 4-year course and placement roadmap.",
  inputSchema: {},
  annotations: hints,
  handler: () =>
    json(DEPARTMENTS.map((d) => ({ id: d.id, name: d.name, short: d.short, tagline: d.tagline }))),
});

export const getDepartmentRoadmap = defineTool({
  name: "get_department_roadmap",
  title: "Get department placement roadmap",
  description: "Get the year-by-year subjects, skills, tools, projects and career roles for one department.",
  inputSchema: {
    department_id: z.string().describe("Department id from list_departments, e.g. 'ece'."),
    year: z.number().int().min(1).max(4).optional().describe("Only return this year (1-4)."),
  },
  annotations: hints,
  handler: ({ department_id, year }) => {
    const d = findDepartment(department_id.toLowerCase());
    if (!d) throw new ToolError(`Unknown department '${department_id}'. Use list_departments.`);
    return json({ ...d, years: year ? d.years.filter((p) => p.year === year) : d.years });
  },
});

export const searchRoadmapsTool = defineTool({
  name: "search_roadmaps",
  title: "Search roadmaps",
  description: "Search skills, tools, subjects and projects across all department roadmaps.",
  inputSchema: { query: z.string().trim().min(2).describe("Skill, tool or project keyword.") },
  annotations: hints,
  handler: ({ query }) => json(searchRoadmaps(query).slice(0, 50)),
});

export const getPrepStages = defineTool({
  name: "get_placement_prep_stages",
  title: "Placement preparation stages",
  description: "Get the four-stage core-company placement preparation timeline.",
  inputSchema: {},
  annotations: hints,
  handler: () => json(PREP_STAGES),
});
