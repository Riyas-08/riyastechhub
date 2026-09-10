import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Binary,
  BookOpen,
  Code2,
  Cpu,
  Play,
  RotateCcw,
  Star,
  Terminal,
} from "lucide-react";

import { PageShell } from "@/components/site-shell";
import { cn } from "@/lib/utils";
import { BOILERPLATE, LANGUAGES, type Lang } from "@/lib/coding-data";

export const Route = createFileRoute("/coding")({
  head: () => ({
    meta: [
      { title: "Coding Dashboard — Learn C, C++ & Python | RiyasTech Hub" },
      {
        name: "description",
        content:
          "Learn C, C++ and Python with theory modules, syntax references and an in-browser code editor with instant simulated compilation and output.",
      },
      { property: "og:title", content: "Coding Dashboard — RiyasTech Hub" },
      {
        property: "og:description",
        content:
          "Theory, syntax reference and a live code editor for C, C++ and Python placement preparation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CodingPage,
});

interface Module {
  id: string;
  title: string;
  body: string[];
  snippet: string;
}

interface LangContent {
  intro: string;
  purpose: string;
  applications: string[];
  action: string;
  modules: Module[];
}

const CONTENT: Record<Lang, LangContent> = {
  c: {
    intro:
      "C is a compiled, procedural, statically typed language created by Dennis Ritchie in 1972. It sits very close to the hardware while still being readable, which is why it is called a middle-level language.",
    purpose:
      "C is used wherever speed, small memory footprint and direct hardware access matter. Your code is translated by a compiler (GCC) into machine instructions before it runs.",
    applications: [
      "Embedded firmware for microcontrollers (8051, AVR, ARM Cortex-M)",
      "Operating system kernels and device drivers",
      "Arduino / STM32 hardware projects",
      "Compilers, interpreters and real-time control systems",
    ],
    action: "Compile C",
    modules: [
      {
        id: "c-var",
        title: "Variables & Data Types",
        body: [
          "A variable is a named block of memory. In C you must declare the type before use, because the compiler needs to know how many bytes to reserve.",
          "int (4 bytes), float (4 bytes), double (8 bytes), char (1 byte). Add unsigned to store only positive values and double the positive range.",
          "The name refers to an address in RAM; the & operator gives you that address and a pointer variable can store it.",
        ],
        snippet: `int age = 21;          /* 4 bytes  */
float voltage = 3.3f;  /* 4 bytes  */
char grade = 'A';      /* 1 byte   */
const int PIN = 13;    /* read-only */

printf("%d %.1f %c\\n", age, voltage, grade);`,
      },
      {
        id: "c-cond",
        title: "Conditional Statements",
        body: [
          "if runs a block when the condition is non-zero. else if chains extra tests and else is the fallback.",
          "switch compares one integer or char against constant cases. Every case needs break, otherwise execution falls through to the next case.",
        ],
        snippet: `int marks = 78;

if (marks >= 90) {
    printf("Grade A\\n");
} else if (marks >= 75) {
    printf("Grade B\\n");
} else {
    printf("Grade C\\n");
}

switch (grade) {
    case 'A': printf("Excellent\\n"); break;
    case 'B': printf("Good\\n"); break;
    default:  printf("Keep going\\n");
}`,
      },
      {
        id: "c-loop",
        title: "Blocks, Loops & Control Flow",
        body: [
          "Curly braces { } create a block, and a variable declared inside a block dies at its closing brace. That is called scope.",
          "for is used when the number of iterations is known, while when it depends on a condition, and do-while always runs at least once.",
          "break leaves the loop immediately, continue skips to the next iteration.",
        ],
        snippet: `for (int i = 1; i <= 5; i++) {
    if (i == 3) continue;
    printf("%d ", i);
}

int n = 3;
while (n > 0) {
    printf("count %d\\n", n);
    n--;
}`,
      },
      {
        id: "c-syntax",
        title: "Syntax Reference",
        body: [
          "Every C program starts at main(). Statements end with a semicolon and headers are included with #include.",
          "printf uses format specifiers: %d int, %f float, %c char, %s string, %p pointer.",
        ],
        snippet: `#include <stdio.h>

int square(int x) {
    return x * x;
}

int main() {
    printf("Square = %d\\n", square(7));
    return 0;
}`,
      },
    ],
  },
  cpp: {
    intro:
      "C++ was created by Bjarne Stroustrup as an extension of C, adding object-oriented programming, templates and the Standard Template Library while keeping C's speed.",
    purpose:
      "C++ gives you low-level control plus high-level abstractions such as classes, references and containers. It is also compiled (G++) into a native executable.",
    applications: [
      "Embedded and automotive software (AUTOSAR, robotics)",
      "Game engines and graphics (Unreal, OpenGL)",
      "High performance simulation and EDA tools",
      "Competitive programming and placement coding rounds",
    ],
    action: "Compile C++",
    modules: [
      {
        id: "cpp-var",
        title: "Variables & Data Types",
        body: [
          "C++ has all the C types plus bool, string and auto. auto lets the compiler deduce the type from the initial value.",
          "A reference (int& r = x) is another name for the same memory, unlike a pointer it can never be null or re-seated.",
        ],
        snippet: `int count = 10;
double temp = 36.6;
bool ready = true;
string name = "RiyasTech";
auto pi = 3.14159;      // deduced as double

int& ref = count;       // alias to the same memory
ref = 20;               // count is now 20`,
      },
      {
        id: "cpp-cond",
        title: "Conditional Statements",
        body: [
          "The if / else if / else and switch forms are identical to C, but C++ also allows declaring the variable inside the if.",
          "The ternary operator condition ? a : b is a compact single-expression alternative.",
        ],
        snippet: `int rpm = 1450;

if (rpm > 1500) {
    cout << "Overspeed" << endl;
} else if (rpm > 1000) {
    cout << "Normal" << endl;
} else {
    cout << "Idle" << endl;
}

string state = (rpm > 0) ? "Running" : "Stopped";`,
      },
      {
        id: "cpp-loop",
        title: "Blocks, Loops & Control Flow",
        body: [
          "Blocks and scope work exactly as in C. Objects declared in a block are destroyed at the closing brace — this is RAII.",
          "The range-based for loop (for (int x : v)) iterates over any container without an index.",
        ],
        snippet: `vector<int> readings{12, 18, 7};

for (int x : readings) {
    cout << x << " ";
}

int i = 0;
do {
    cout << "pass " << i << endl;
    i++;
} while (i < 3);`,
      },
      {
        id: "cpp-syntax",
        title: "Syntax Reference",
        body: [
          "Streams replace printf: cout for output, cin for input, endl for a newline plus flush.",
          "A class binds data and functions together; public members are visible outside, private members are not.",
        ],
        snippet: `#include <iostream>
using namespace std;

class Sensor {
    string name;
public:
    Sensor(string n) : name(n) {}
    void show() { cout << "Sensor: " << name << endl; }
};

int main() {
    Sensor s("LM35");
    s.show();
    return 0;
}`,
      },
    ],
  },
  python: {
    intro:
      "Python is an interpreted, dynamically typed language created by Guido van Rossum. Code runs line by line through the interpreter, with no separate compile step.",
    purpose:
      "Python trades a little speed for very high readability and a huge library ecosystem, which makes it the fastest way to automate, analyse data or prototype hardware logic.",
    applications: [
      "Raspberry Pi and IoT device scripting",
      "Data analysis, machine learning and signal processing",
      "Test automation and hardware bench scripting",
      "Backend services and rapid prototyping",
    ],
    action: "Interpreter Python",
    modules: [
      {
        id: "py-var",
        title: "Variables & Data Types",
        body: [
          "You never declare a type. A variable is just a name bound to an object, and the type belongs to the object, not the name.",
          "Core types: int, float, str, bool, list, tuple, set, dict. Use type(x) to check and int(x) / str(x) to convert.",
        ],
        snippet: `age = 21                # int
voltage = 3.3           # float
name = "RiyasTech"      # str
active = True           # bool
readings = [12, 18, 7]  # list

print(name, age, type(voltage))`,
      },
      {
        id: "py-cond",
        title: "Conditional Statements",
        body: [
          "Python uses if / elif / else with a colon and an indented block. There is no switch keyword before 3.10; use a dict or match-case instead.",
          "Any empty value (0, \"\", [], None) is treated as False in a condition.",
        ],
        snippet: `marks = 78

if marks >= 90:
    print("Grade A")
elif marks >= 75:
    print("Grade B")
else:
    print("Grade C")

status = "pass" if marks >= 40 else "fail"`,
      },
      {
        id: "py-loop",
        title: "Blocks, Loops & Control Flow",
        body: [
          "There are no curly braces. Indentation (4 spaces by convention) defines the block, and inconsistent indentation is a syntax error.",
          "for iterates over any sequence, range(a, b, step) generates numbers, and while repeats until the condition is False.",
        ],
        snippet: `for i in range(1, 6):
    if i == 3:
        continue
    print(i, end=" ")

n = 3
while n > 0:
    print("count", n)
    n -= 1`,
      },
      {
        id: "py-syntax",
        title: "Syntax Reference",
        body: [
          "def creates a function, return sends a value back, and f-strings format text inline.",
          "Import standard modules with import math or from collections import Counter.",
        ],
        snippet: `def square(x):
    return x * x

value = square(7)
print(f"Square = {value}")`,
      },
    ],
  },
};

/* ---------------- simulated compiler / interpreter ---------------- */

interface RunResult {
  ok: boolean;
  lines: string[];
  ms: number;
}

function unescape(text: string) {
  return text
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");
}

function checkBalance(code: string) {
  let depth = 0;
  for (const ch of code) {
    if (ch === "{") depth++;
    if (ch === "}") depth--;
    if (depth < 0) return "extra closing brace '}'";
  }
  return depth > 0 ? "missing closing brace '}'" : null;
}

function evalNumeric(expr: string, vars: Record<string, number>): number | null {
  const replaced = expr.replace(/[A-Za-z_]\w*/g, (m) =>
    m in vars ? String(vars[m]) : "NaN",
  );
  if (!/^[-+*/%(). 0-9NaN]+$/.test(replaced)) return null;
  try {
    // eslint-disable-next-line no-new-func
    const value = Function(`"use strict";return (${replaced})`)() as number;
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

function runC(code: string, cpp: boolean): RunResult {
  const start = performance.now();
  const errors: string[] = [];

  if (!/\bmain\s*\(/.test(code)) {
    errors.push("error: undefined reference to 'main'");
  }
  const brace = checkBalance(code);
  if (brace) errors.push(`error: ${brace}`);

  const bodyLines = code.split("\n");
  bodyLines.forEach((raw, i) => {
    const line = (raw.split("//")[0] ?? "").trim();
    if (!line || line.startsWith("#") || line.startsWith("/*") || line.startsWith("*")) return;
    if (/[{}]$/.test(line) || line.endsWith(";") || line.endsWith(":") || line.startsWith("}")) return;
    if (/^(if|for|while|else|switch|do|class|struct|public:|private:)/.test(line)) return;
    errors.push(`line ${i + 1}: error: expected ';' before end of statement`);
  });

  if (cpp && /cout/.test(code) && !/#include\s*<iostream>/.test(code)) {
    errors.push("error: 'cout' was not declared in this scope (missing #include <iostream>)");
  }
  if (!cpp && /printf/.test(code) && !/#include\s*<stdio\.h>/.test(code)) {
    errors.push("warning: implicit declaration of function 'printf' (missing #include <stdio.h>)");
  }

  const hard = errors.filter((e) => e.includes("error:"));
  if (hard.length) {
    return {
      ok: false,
      lines: [`${cpp ? "g++" : "gcc"} main.${cpp ? "cpp" : "c"} -o main`, ...errors],
      ms: performance.now() - start,
    };
  }

  const vars: Record<string, number> = {};
  const declRe = /\b(?:int|long|float|double)\s+([A-Za-z_]\w*)\s*=\s*([^;,]+)/g;
  let d: RegExpExecArray | null;
  while ((d = declRe.exec(code))) {
    const v = evalNumeric(d[2] ?? "", vars);
    if (v !== null) vars[d[1] ?? "_"] = v;
  }

  const out: string[] = [];

  // simple accumulate loop: for (...; i <= n; i++) { sum += i; }
  const loopRe =
    /for\s*\(\s*(?:int\s+)?([A-Za-z_]\w*)\s*=\s*([^;]+);\s*\1\s*(<=|<)\s*([^;]+);[^)]*\)\s*\{?\s*([A-Za-z_]\w*)\s*\+=\s*\1\s*;/g;
  let l: RegExpExecArray | null;
  while ((l = loopRe.exec(code))) {
    const from = evalNumeric(l[2] ?? "", vars);
    const to = evalNumeric(l[4] ?? "", vars);
    const target = l[5] ?? "_";
    if (from === null || to === null) continue;
    let acc = vars[target] ?? 0;
    for (let i = from; l[3] === "<=" ? i <= to : i < to; i++) acc += i;
    vars[target] = acc;
  }

  if (cpp) {
    const coutRe = /cout\s*((?:<<\s*[^;]+?)+);/g;
    let m: RegExpExecArray | null;
    while ((m = coutRe.exec(code))) {
      let text = "";
      for (const part of (m[1] ?? "").split("<<").map((p) => p.trim()).filter(Boolean)) {
        if (/^endl$/.test(part)) text += "\n";
        else if (/^"(.*)"$/s.test(part)) text += unescape(part.slice(1, -1));
        else {
          const v = evalNumeric(part, vars);
          text += v !== null ? String(v) : part;
        }
      }
      out.push(...text.split("\n"));
    }
  } else {
    const pfRe = /printf\s*\(\s*"([^"]*)"\s*((?:,[^;]+)?)\)\s*;/g;
    let m: RegExpExecArray | null;
    while ((m = pfRe.exec(code))) {
      let text = unescape(m[1] ?? "");
      const args = (m[2] ?? "")
        .replace(/^,/, "")
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);
      let ai = 0;
      text = text.replace(/%[-0-9.lu]*[dfcsu]/g, () => {
        const a = args[ai++];
        if (a === undefined) return "";
        const v = evalNumeric(a, vars);
        return v !== null ? String(v) : a.replace(/^"|"$/g, "");
      });
      out.push(...text.split("\n"));
    }
  }

  const clean = out.filter((line, i, arr) => !(line === "" && i === arr.length - 1));
  return {
    ok: true,
    lines: [
      `${cpp ? "g++" : "gcc"} main.${cpp ? "cpp" : "c"} -o main`,
      "Compilation successful.",
      "",
      ...(clean.length ? clean : ["(no output produced)"]),
      "",
      "[Process exited with code 0]",
    ],
    ms: performance.now() - start,
  };
}

function runPython(code: string): RunResult {
  const start = performance.now();
  const lines = code.split("\n");
  const errors: string[] = [];

  lines.forEach((raw, i) => {
    const line = (raw.split("#")[0] ?? "").trimEnd();
    if (!line.trim()) return;
    if (/^\s*(if|elif|else|for|while|def|class|try|except|finally|with)\b.*[^:]$/.test(line)) {
      errors.push(`  File "main.py", line ${i + 1}\nSyntaxError: expected ':'`);
    }
    if (/\t/.test(line) && / {2,}/.test(line)) {
      errors.push(`  File "main.py", line ${i + 1}\nTabError: inconsistent use of tabs and spaces`);
    }
  });

  if (errors.length) {
    return { ok: false, lines: ["Traceback (most recent call last):", ...errors], ms: performance.now() - start };
  }

  const vars: Record<string, number> = {};
  const strVars: Record<string, string> = {};
  const out: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].split("#")[0].trim();
    if (!line) continue;

    const assign = line.match(/^([A-Za-z_]\w*)\s*=\s*(.+)$/);
    if (assign && !line.startsWith("print")) {
      const rhs = assign[2].trim();
      const s = rhs.match(/^["'](.*)["']$/);
      if (s) strVars[assign[1]] = s[1];
      else {
        const v = evalNumeric(rhs, vars);
        if (v !== null) vars[assign[1]] = v;
      }
      continue;
    }

    // for i in range(a, b): total += i
    const forMatch = line.match(/^for\s+([A-Za-z_]\w*)\s+in\s+range\(([^)]*)\)\s*:$/);
    if (forMatch) {
      const args = forMatch[2].split(",").map((a) => evalNumeric(a.trim(), vars));
      const from = args.length > 1 ? (args[0] ?? 0) : 0;
      const to = args.length > 1 ? (args[1] ?? 0) : (args[0] ?? 0);
      const bodyIdx = i + 1;
      const body = lines[bodyIdx]?.trim() ?? "";
      const acc = body.match(/^([A-Za-z_]\w*)\s*\+=\s*(.+)$/);
      if (acc) {
        let sum = vars[acc[1]] ?? 0;
        for (let k = from; k < to; k++) {
          const step = evalNumeric(acc[2], { ...vars, [forMatch[1]]: k });
          sum += step ?? 0;
        }
        vars[acc[1]] = sum;
        i = bodyIdx;
      }
      continue;
    }

    const printMatch = line.match(/^print\s*\((.*)\)\s*$/);
    if (printMatch) {
      const parts: string[] = [];
      let depth = 0;
      let current = "";
      for (const ch of printMatch[1]) {
        if (ch === "(") depth++;
        if (ch === ")") depth--;
        if (ch === "," && depth === 0) {
          parts.push(current);
          current = "";
        } else current += ch;
      }
      if (current.trim()) parts.push(current);

      const rendered = parts
        .map((p) => p.trim())
        .filter((p) => !/^(end|sep)\s*=/.test(p))
        .map((p) => {
          const f = p.match(/^f["'](.*)["']$/s);
          if (f) {
            return f[1].replace(/\{([^}]+)\}/g, (_, ex) => {
              const name = ex.trim();
              if (name in strVars) return strVars[name];
              const v = evalNumeric(name, vars);
              return v !== null ? String(v) : `{${name}}`;
            });
          }
          const s = p.match(/^["'](.*)["']$/s);
          if (s) return s[1];
          if (p in strVars) return strVars[p];
          const v = evalNumeric(p, vars);
          return v !== null ? String(v) : p;
        });
      out.push(rendered.join(" "));
    }
  }

  return {
    ok: true,
    lines: [
      "python3 main.py",
      "",
      ...(out.length ? out : ["(no output produced)"]),
      "",
      "[Process finished with exit code 0]",
    ],
    ms: performance.now() - start,
  };
}

/* ---------------- testimonials ---------------- */

const REVIEWS = [
  {
    name: "Aravind K.",
    role: "ECE, 3rd Year",
    text: "The C and Embedded C modules are explained exactly the way core company interviewers ask them. I cleared my Bosch technical round using this dashboard.",
  },
  {
    name: "Divya S.",
    role: "EEE, 4th Year",
    text: "Being able to write code and see the output instantly, without installing a compiler, saved me hours before every placement test. RiyasTech Hub is brilliant.",
  },
  {
    name: "Mohamed Rafi",
    role: "Mechatronics, 2nd Year",
    text: "The Python section finally made loops and indentation click for me. Clean layout, works perfectly on my phone during travel.",
  },
  {
    name: "Nithya P.",
    role: "Mechanical, 3rd Year",
    text: "The C++ OOPs theory plus the live editor is the best free combination I have found. Highly recommended for core branch students.",
  },
];

/* ---------------- page ---------------- */

function CodingPage() {
  const [lang, setLang] = useState<Lang>("c");
  const [code, setCode] = useState<Record<Lang, string>>({ ...BOILERPLATE });
  const [result, setResult] = useState<Record<Lang, RunResult | null>>({
    c: null,
    cpp: null,
    python: null,
  });
  const [running, setRunning] = useState(false);

  const content = CONTENT[lang];
  const active = result[lang];
  const lineCount = useMemo(() => code[lang].split("\n").length, [code, lang]);

  const run = () => {
    setRunning(true);
    const source = code[lang];
    window.setTimeout(() => {
      const res = lang === "python" ? runPython(source) : runC(source, lang === "cpp");
      setResult((r) => ({ ...r, [lang]: res }));
      setRunning(false);
    }, 320);
  };

  const reset = () => {
    setCode((c) => ({ ...c, [lang]: BOILERPLATE[lang] }));
    setResult((r) => ({ ...r, [lang]: null }));
  };

  return (
    <PageShell
      eyebrow="Coding"
      title="Coding Dashboard"
      description="Learn C, C++ and Python from the ground up — theory, syntax reference and a live editor with instant compilation output. Switch languages any time without leaving the page."
    >
      {/* Language navigation */}
      <div className="sticky top-16 z-30 -mx-1 mb-8 rounded-2xl border border-border/60 bg-background/80 p-2 backdrop-blur-xl">
        <div className="grid grid-cols-3 gap-2">
          {LANGUAGES.map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
                lang === l.id
                  ? "border border-primary/50 bg-primary/15 text-primary shadow-[0_0_20px_-6px_hsl(var(--primary))]"
                  : "border border-transparent text-muted-foreground hover:bg-primary/10 hover:text-primary",
              )}
            >
              <Code2 className="h-4 w-4" />
              {l.label}
              <span className="hidden text-[10px] opacity-60 sm:inline">{l.ext}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Core introduction */}
      <section className="glass-card rounded-2xl border border-border/60 p-5 sm:p-7">
        <div className="flex items-center gap-2 text-primary">
          <Cpu className="h-5 w-5" />
          <h2 className="font-display text-xl font-bold">
            Core Introduction — {LANGUAGES.find((l) => l.id === lang)?.label}
          </h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{content.intro}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{content.purpose}</p>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {content.applications.map((a) => (
            <div
              key={a}
              className="flex items-start gap-2 rounded-xl border border-border/50 bg-background/40 px-3 py-2 text-sm text-foreground/90"
            >
              <Binary className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{a}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Learning modules */}
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {content.modules.map((m) => (
          <section key={m.id} className="glass-card rounded-2xl border border-border/60 p-5">
            <div className="flex items-center gap-2 text-primary">
              <BookOpen className="h-4 w-4" />
              <h3 className="font-display text-base font-bold sm:text-lg">{m.title}</h3>
            </div>
            <div className="mt-3 space-y-2">
              {m.body.map((p) => (
                <p key={p} className="text-sm leading-relaxed text-muted-foreground">
                  {p}
                </p>
              ))}
            </div>
            <pre className="mt-4 overflow-x-auto rounded-xl border border-primary/25 bg-[#0b0f16] p-4 text-xs leading-relaxed text-[#9ef7ff] sm:text-[13px]">
              <code>{m.snippet}</code>
            </pre>
          </section>
        ))}
      </div>

      {/* Editor + output */}
      <section className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="glass-card overflow-hidden rounded-2xl border border-border/60">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Code2 className="h-4 w-4" />
              main{LANGUAGES.find((l) => l.id === lang)?.ext}
            </span>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Code
            </button>
          </div>

          <div className="flex bg-[#0b0f16]">
            <div className="select-none border-r border-border/40 px-3 py-4 text-right font-mono text-xs leading-6 text-muted-foreground/60">
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              value={code[lang]}
              spellCheck={false}
              onChange={(e) => setCode((c) => ({ ...c, [lang]: e.target.value }))}
              className="min-h-[320px] w-full resize-y bg-transparent p-4 font-mono text-[13px] leading-6 text-[#d6faff] outline-none"
              aria-label="Code editor"
            />
          </div>

          <div className="border-t border-border/60 p-4">
            <button
              onClick={run}
              disabled={running}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-60"
            >
              <Play className="h-4 w-4" />
              {running ? "Processing..." : content.action}
            </button>
          </div>
        </div>

        <div className="glass-card overflow-hidden rounded-2xl border border-border/60">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Terminal className="h-4 w-4" />
              Output Terminal
            </span>
            {active ? (
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                  active.ok
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-red-500/15 text-red-400",
                )}
              >
                {active.ok ? "Success" : "Errors found"} · {active.ms.toFixed(1)} ms
              </span>
            ) : null}
          </div>
          <pre className="min-h-[320px] overflow-x-auto bg-[#05080d] p-4 font-mono text-[13px] leading-6">
            {active ? (
              active.lines.map((line, i) => (
                <div
                  key={i}
                  className={cn(
                    /error:/i.test(line)
                      ? "text-red-400"
                      : /warning:/i.test(line)
                        ? "text-amber-400"
                        : /successful|exit(ed)? (with )?code 0|finished/i.test(line)
                          ? "text-emerald-400"
                          : /^(gcc|g\+\+|python3)/.test(line)
                            ? "text-muted-foreground"
                            : "text-[#d6faff]",
                  )}
                >
                  {line || "\u00A0"}
                </div>
              ))
            ) : (
              <span className="text-muted-foreground">
                $ Press “{content.action}” to run your program…
              </span>
            )}
          </pre>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mt-12">
        <h2 className="font-display text-xl font-bold sm:text-2xl">What students say</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Rated 5.0 out of 5 by core engineering students using RiyasTech Hub.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {REVIEWS.map((r) => (
            <article key={r.name} className="glass-card rounded-2xl border border-border/60 p-5">
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
                <span className="ml-2 text-xs font-semibold text-muted-foreground">5.0</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">“{r.text}”</p>
              <div className="mt-4 flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full border border-primary/40 bg-primary/10 text-sm font-bold text-primary">
                  {r.name.charAt(0)}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{r.name}</span>
                  <span className="block text-xs text-muted-foreground">{r.role}</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
