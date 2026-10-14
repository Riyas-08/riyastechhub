import { auth, defineMcp } from "@lovable.dev/mcp-js";
import { getDepartmentRoadmap, getPrepStages, listDepartments, searchRoadmapsTool } from "./tools/roadmaps";
import { getCompany, listBranches, listRoles, searchCompanies } from "./tools/companies";
import { getPlacementGuide } from "./tools/placement";
import { getCodingProblem, getCodingSyllabus, listCodingProblems } from "./tools/coding";

const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "riyastech-hub",
  title: "RiyasTech Hub",
  version: "0.2.0",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  instructions:
    "Read-only tools for RiyasTech Hub, a placement guide for core engineering students. Browse department placement roadmaps (list_departments, get_department_roadmap, search_roadmaps), core companies and job roles (list_branches, search_companies, get_company, list_job_roles), and C/C++/Python coding practice (list_coding_problems, get_coding_problem, get_coding_syllabus), and the Placement page guide (get_placement_guide).",
  tools: [
    listDepartments,
    getDepartmentRoadmap,
    searchRoadmapsTool,
    getPrepStages,
    listBranches,
    searchCompanies,
    getCompany,
    listRoles,
    listCodingProblems,
    getCodingProblem,
    getCodingSyllabus,
    getPlacementGuide,
  ],
});
