import { defineMcp } from "@lovable.dev/mcp-js";
import { getDepartmentRoadmap, getPrepStages, listDepartments, searchRoadmapsTool } from "./tools/roadmaps";
import { getCompany, listBranches, listRoles, searchCompanies } from "./tools/companies";
import { getCodingProblem, getCodingSyllabus, listCodingProblems } from "./tools/coding";

export default defineMcp({
  name: "riyastech-hub",
  title: "RiyasTech Hub",
  version: "0.1.0",
  instructions:
    "Read-only tools for RiyasTech Hub, a placement guide for core engineering students. Browse department placement roadmaps (list_departments, get_department_roadmap, search_roadmaps), core companies and job roles (list_branches, search_companies, get_company, list_job_roles), and C/C++/Python coding practice (list_coding_problems, get_coding_problem, get_coding_syllabus).",
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
  ],
});
