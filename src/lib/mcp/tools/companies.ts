import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { BRANCHES, COMPANIES, ROLES } from "@/lib/companies-data";

const json = (value: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] });
const hints = { readOnlyHint: true, idempotentHint: true, openWorldHint: false };

export const listBranches = defineTool({
  name: "list_branches",
  title: "List engineering branches",
  description: "List the engineering branches used by the core company explorer, with their industry domains.",
  inputSchema: {},
  annotations: hints,
  handler: () => json(BRANCHES),
});

export const searchCompanies = defineTool({
  name: "search_companies",
  title: "Search core companies",
  description: "Find core engineering companies by branch, industry or keyword.",
  inputSchema: {
    branch: z.string().optional().describe("Branch id from list_branches, e.g. 'ece'."),
    industry: z.string().optional().describe("Industry or domain keyword, e.g. 'semiconductor'."),
    query: z.string().optional().describe("Free-text keyword matched against name, roles and skills."),
  },
  annotations: hints,
  handler: ({ branch, industry, query }) => {
    const ind = industry?.toLowerCase();
    const q = query?.toLowerCase();
    const hits = COMPANIES.filter(
      (c) =>
        (!branch || c.suitableBranches.includes(branch.toLowerCase() as never)) &&
        (!ind || c.industry.toLowerCase().includes(ind) || c.domains.some((d) => d.toLowerCase().includes(ind))) &&
        (!q || JSON.stringify(c).toLowerCase().includes(q)),
    );
    return json(
      hits.map((c) => ({ id: c.id, name: c.name, industry: c.industry, jobRoles: c.jobRoles, difficulty: c.difficulty })),
    );
  },
});

export const getCompany = defineTool({
  name: "get_company",
  title: "Get company profile",
  description: "Get a company's roles, required skills, tools, subjects, projects and interview topics.",
  inputSchema: { company_id: z.string().describe("Company id from search_companies.") },
  annotations: hints,
  handler: ({ company_id }) => {
    const c = COMPANIES.find((x) => x.id === company_id);
    if (!c) throw new ToolError(`Unknown company '${company_id}'. Use search_companies.`);
    return json(c);
  },
});

export const listRoles = defineTool({
  name: "list_job_roles",
  title: "List core job roles",
  description: "List core engineering job roles with hiring companies, skills, tools and learning path.",
  inputSchema: {},
  annotations: hints,
  handler: () => json(ROLES),
});
