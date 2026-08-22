const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.5-flash";

type Msg = { role: "system" | "user" | "assistant"; content: string };

async function callGateway(messages: Msg[], jsonMode: boolean) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured yet.");

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (res.status === 429) throw new Error("Rate limit reached. Please retry in a moment.");
  if (res.status === 402) throw new Error("AI credits exhausted for this workspace.");
  if (!res.ok) throw new Error(`AI request failed (${res.status})`);

  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return json.choices?.[0]?.message?.content ?? "";
}

function parseJson<T>(raw: string, fallback: T): T {
  const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1)) as T;
      } catch {
        return fallback;
      }
    }
    return fallback;
  }
}

const LANG_RULE =
  "The user may write in English, Tamil, or Tanglish (Tamil written in English letters). Understand all three and always reply in the same language style the user used.";

export type HardwareComponent = {
  name: string;
  category: string;
  quantity: string;
  specification: string;
  role: string;
  estimatedPriceInr: number;
  searchQuery: string;
  guide: string;
};

export type AnalysisResult = {
  detectedLanguage: string;
  summary: string;
  workingPrinciple: string[];
  components: HardwareComponent[];
  blockDiagram: string[];
};

export async function analyzeHardwareProject(title: string, description: string) {
  const raw = await callGateway(
    [
      {
        role: "system",
        content: `You are a senior embedded-hardware design engineer building bills of materials for Indian engineering students. ${LANG_RULE}
Return STRICT JSON only, matching:
{"detectedLanguage":string,"summary":string,"workingPrinciple":string[],"blockDiagram":string[],"components":[{"name":string,"category":"Microcontroller|Dev Board|IC|Sensor|Actuator|Motor|Power|Display|Communication|Passive|Semiconductor|Relay|Mechanical|Misc","quantity":string,"specification":string,"role":string,"estimatedPriceInr":number,"searchQuery":string,"guide":string}]}
Rules: components MUST be specific to THIS project only (exact part numbers such as ATmega328P, L298N, MCP3008, IRF540N, HC-05, 7805, BC547, 10k resistor etc). Never output generic filler. Include microcontroller/dev board, sensors, drivers/actuators, power supply chain, protection, passives, connectors and mechanical parts. 18-35 components. estimatedPriceInr is a realistic Indian retail price per unit. searchQuery is the exact phrase to search on Indian electronics stores. guide is 2-3 sentences on how the part works and its circuit role.`,
      },
      {
        role: "user",
        content: `Project title: ${title}\n\nAbout this project: ${description}`,
      },
    ],
    true,
  );

  const parsed = parseJson<AnalysisResult>(raw, {
    detectedLanguage: "English",
    summary: "",
    workingPrinciple: [],
    blockDiagram: [],
    components: [],
  });
  if (!parsed.components?.length) throw new Error("Could not generate a hardware list. Try again.");
  return parsed;
}

export async function generateViva(title: string, description: string, count: number) {
  const raw = await callGateway(
    [
      {
        role: "system",
        content: `You are an examiner preparing a viva-voce question bank for a hardware project. ${LANG_RULE}
Return STRICT JSON: {"questions":[{"topic":string,"question":string,"answer":string,"difficulty":"Basic|Intermediate|Advanced"}]}
Generate exactly ${count} unique questions covering component theory, circuit schematics, power design, embedded code logic, troubleshooting, safety and project defence. Answers must be technically detailed (2-5 sentences).`,
      },
      { role: "user", content: `Project: ${title}\nDetails: ${description}` },
    ],
    true,
  );
  const parsed = parseJson<{
    questions: { topic: string; question: string; answer: string; difficulty: string }[];
  }>(raw, { questions: [] });
  return parsed.questions ?? [];
}

export async function troubleshootQuery(query: string, context: string) {
  return callGateway(
    [
      {
        role: "system",
        content: `You are an expert electronics troubleshooting assistant. ${LANG_RULE}
Give a numbered step-by-step diagnostic procedure: likely causes, what to measure with a multimeter/oscilloscope, expected values, and the fix. Use short markdown. Mention safety when mains voltage is involved.`,
      },
      { role: "user", content: context ? `Project context: ${context}\n\nDoubt: ${query}` : query },
    ],
    false,
  );
}

export async function riyaChat(messages: Msg[], context: string) {
  return callGateway(
    [
      {
        role: "system",
        content: `You are Riya AI, the hardware expert assistant of RiyasTech Hub (Kumaraguru College of Technology). ${LANG_RULE}
You specialise in electronic components, circuit design, PCB layout, microcontrollers, sensors, motor drivers, power electronics, embedded firmware and hardware troubleshooting. Answer in depth with values, pin details, formulas and practical wiring advice. Use markdown headings and bullet points. If a question is not about hardware/electronics, answer briefly and steer back to hardware.${context ? `\nCurrent student project: ${context}` : ""}`,
      },
      ...messages,
    ],
    false,
  );
}
export async function identifyComponentImage(imageDataUrl: string, note: string) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured yet.");

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `You are Riya AI, a hardware component identification expert. ${LANG_RULE}
Identify the electronic component in the photo. Reply in markdown with: **Component name** (exact part number if visible), category, key specifications, pin/terminal details, typical circuit use, and an approximate Indian retail price in rupees. If unclear, list the 2-3 most likely candidates and say what marking to check.`,
        },
        {
          role: "user",
          content: [
            { type: "text", text: note || "Identify this component." },
            { type: "image_url", image_url: { url: imageDataUrl } },
          ],
        },
      ],
    }),
  });

  if (res.status === 429) throw new Error("Rate limit reached. Please retry in a moment.");
  if (res.status === 402) throw new Error("AI credits exhausted for this workspace.");
  if (!res.ok) throw new Error(`AI request failed (${res.status})`);
  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return json.choices?.[0]?.message?.content ?? "Could not identify the component.";
}
