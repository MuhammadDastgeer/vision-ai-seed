import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const Input = z.object({
  goal: z.string().trim().min(3).max(2000),
  role: z.string().trim().max(200).optional().or(z.literal("")),
  audience: z.string().trim().max(200).optional().or(z.literal("")),
  context: z.string().trim().max(3000).optional().or(z.literal("")),
  tone: z.string().trim().max(60).optional().or(z.literal("")),
  outputFormat: z.string().trim().max(60).optional().or(z.literal("")),
});

export type PromptBuilderInput = z.infer<typeof Input>;
export type PromptBuilderOutput = {
  optimized: string;
  system: string;
  expert: string;
};

function extractJson(text: string): any {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = (fenced ? fenced[1] : text).trim();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Model did not return JSON.");
  return JSON.parse(raw.slice(start, end + 1));
}

export const buildPrompts = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }): Promise<PromptBuilderOutput> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI is not configured.");

    const gateway = createLovableAiGatewayProvider(key);

    const system = `You are a world-class prompt engineer. Given a user's intent, you produce three distinct, production-ready prompts:

1. "optimized": A concise, well-structured user prompt that maximizes clarity and quality on any capable LLM. Use clear sections (Task, Context, Constraints, Output Format) in Markdown.
2. "system": A system message that defines the assistant's persona, capabilities, boundaries, and response style for the given goal.
3. "expert": An advanced power-user prompt that uses techniques like role-priming, chain-of-thought guidance, few-shot scaffolding hints, evaluation rubrics, and explicit edge-case handling. More detailed than "optimized".

Return ONLY a valid JSON object with exactly these keys: "optimized", "system", "expert". Each value is a Markdown string. No prose outside the JSON. No code fences.`;

    const user = `Build three prompts for the following intent.

Goal: ${data.goal}
Role / Persona: ${data.role || "(unspecified — choose a sensible expert role)"}
Audience: ${data.audience || "general"}
Context: ${data.context || "—"}
Tone: ${data.tone || "neutral, professional"}
Desired output format: ${data.outputFormat || "markdown"}

Respond with a JSON object: { "optimized": "...", "system": "...", "expert": "..." }`;

    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system,
      prompt: user,
    });

    const parsed = extractJson(text);
    const out: PromptBuilderOutput = {
      optimized: String(parsed.optimized ?? "").trim(),
      system: String(parsed.system ?? "").trim(),
      expert: String(parsed.expert ?? "").trim(),
    };
    if (!out.optimized || !out.system || !out.expert) {
      throw new Error("Incomplete response from model.");
    }
    return out;
  });
