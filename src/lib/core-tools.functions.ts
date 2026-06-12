import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const ToolInput = z.object({
  tool: z.enum(["cv-generator", "prompt-builder", "roadmap-builder", "dataset-creator"]),
  payload: z.record(z.string(), z.any()),
});

function buildPrompt(tool: string, p: Record<string, any>): { system: string; user: string } {
  switch (tool) {
    case "cv-generator":
      return {
        system:
          "You are an expert resume writer. Produce a polished, ATS-friendly CV in clean Markdown. Use clear sections: Header, Summary, Experience, Education, Skills, Projects. No commentary.",
        user: `Generate a professional CV.

Full name: ${p.fullName}
Email: ${p.email}
Phone: ${p.phone || "—"}
Location: ${p.location || "—"}
Target role: ${p.targetRole}
Years of experience: ${p.years}
Skills: ${p.skills}
Experience:
${p.experience}
Education:
${p.education}
${p.extras ? `Other:\n${p.extras}` : ""}`,
      };
    case "prompt-builder":
      return {
        system:
          "You are a prompt engineering expert. Produce a high-quality, reusable LLM prompt with clearly labeled sections (Role, Context, Task, Constraints, Output Format, Examples). Return only the final prompt in Markdown.",
        user: `Build a prompt.

Goal: ${p.goal}
Target model: ${p.model || "any capable LLM"}
Audience: ${p.audience || "general"}
Tone: ${p.tone || "neutral"}
Output format: ${p.outputFormat || "markdown"}
Constraints: ${p.constraints || "none"}
Extra context: ${p.context || "—"}`,
      };
    case "roadmap-builder":
      return {
        system:
          "You are a senior learning and career coach. Produce a structured learning roadmap in Markdown with phases, weeks, topics, resources, and milestones. Be concrete and actionable.",
        user: `Create a learning roadmap.

Topic / Goal: ${p.topic}
Current level: ${p.level}
Target level: ${p.target}
Available time per week: ${p.hoursPerWeek} hours
Duration: ${p.durationWeeks} weeks
Preferred resources: ${p.resources || "any"}
Notes: ${p.notes || "—"}`,
      };
    case "dataset-creator":
      return {
        system:
          "You are a data generation expert. Produce a synthetic dataset as valid JSON only — an array of objects matching the requested schema. No prose, no Markdown fences, just JSON.",
        user: `Generate a synthetic dataset.

Domain: ${p.domain}
Number of rows: ${p.rows}
Fields (name:type, comma separated): ${p.fields}
Constraints: ${p.constraints || "realistic, varied values"}

Return ONLY a JSON array.`,
      };
    default:
      return { system: "You are a helpful assistant.", user: JSON.stringify(p) };
  }
}

export const runCoreTool = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => ToolInput.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI is not configured.");

    const gateway = createLovableAiGatewayProvider(key);
    const { system, user } = buildPrompt(data.tool, data.payload);

    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system,
      prompt: user,
    });

    return { output: text };
  });
