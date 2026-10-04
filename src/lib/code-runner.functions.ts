import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Real compilation/execution is delegated to the free Wandbox sandbox (wandbox.org).
const COMPILERS = {
  c: { compiler: "gcc-13.2.0-c", options: "-O2 -std=c17 -lm" },
  cpp: { compiler: "gcc-13.2.0", options: "-O2 -std=c++17" },
  python: { compiler: "cpython-3.12.7", options: "" },
} as const;

export interface RunCodeResult {
  ok: boolean;
  lines: string[];
  ms: number;
}

export const runCode = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        lang: z.enum(["c", "cpp", "python"]),
        code: z.string().min(1).max(50_000),
        stdin: z.string().max(10_000).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }): Promise<RunCodeResult> => {
    const cfg = COMPILERS[data.lang];
    const start = Date.now();
    const res = await fetch("https://wandbox.org/api/compile.json", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        compiler: cfg.compiler,
        code: data.code,
        stdin: data.stdin ?? "",
        "compiler-option-raw": cfg.options.split(" ").filter(Boolean).join("\n"),
        save: false,
      }),
    });
    const ms = Date.now() - start;
    if (!res.ok) {
      return {
        ok: false,
        ms,
        lines: [`The code runner is unavailable right now (status ${res.status}). Please try again shortly.`],
      };
    }
    const out = (await res.json()) as {
      status?: string;
      signal?: string;
      compiler_error?: string;
      program_output?: string;
      program_error?: string;
    };
    const lines: string[] = [];
    if (out.compiler_error) lines.push(...out.compiler_error.trimEnd().split("\n"));
    if (out.program_output) lines.push(...out.program_output.replace(/\n$/, "").split("\n"));
    if (out.program_error) lines.push(...out.program_error.trimEnd().split("\n"));
    const ok = out.status === "0" && !out.signal;
    if (!ok) lines.push(`Process exited with ${out.signal ? `signal ${out.signal}` : `code ${out.status ?? "?"}`}`);
    if (lines.length === 0) lines.push("(program produced no output)");
    return { ok, ms, lines };
  });
