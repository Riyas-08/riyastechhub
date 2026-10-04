import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { PROBLEMS, SYLLABUS } from "@/lib/coding-data";

const json = (value: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] });
const hints = { readOnlyHint: true, idempotentHint: true, openWorldHint: false };

export const listCodingProblems = defineTool({
  name: "list_coding_problems",
  title: "List coding problems",
  description: "List placement coding practice problems, optionally filtered by language and difficulty.",
  inputSchema: {
    language: z.enum(["c", "cpp", "python"]).optional(),
    difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),
  },
  annotations: hints,
  handler: ({ language, difficulty }) =>
    json(
      PROBLEMS.filter((p) => (!language || p.langs.includes(language)) && (!difficulty || p.difficulty === difficulty)).map(
        (p) => ({ id: p.id, title: p.title, difficulty: p.difficulty, languages: p.langs, company: p.company }),
      ),
    ),
});

export const getCodingProblem = defineTool({
  name: "get_coding_problem",
  title: "Get coding problem",
  description: "Get a coding problem's statement and sample test cases.",
  inputSchema: { problem_id: z.string().describe("Problem id from list_coding_problems.") },
  annotations: hints,
  handler: ({ problem_id }) => {
    const p = PROBLEMS.find((x) => x.id === problem_id);
    if (!p) throw new ToolError(`Unknown problem '${problem_id}'. Use list_coding_problems.`);
    return json(p);
  },
});

export const getCodingSyllabus = defineTool({
  name: "get_coding_syllabus",
  title: "Get coding syllabus",
  description: "Get the C, C++ or Python placement syllabus with theory and example code.",
  inputSchema: { language: z.enum(["c", "cpp", "python"]) },
  annotations: hints,
  handler: ({ language }) => json(SYLLABUS[language]),
});
