import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const Input = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  location: z.string().trim().max(120).optional().or(z.literal("")),
  targetRole: z.string().trim().min(2).max(160),
  skills: z.string().trim().min(2).max(2000),
  experience: z.string().trim().min(5).max(6000),
  education: z.string().trim().min(2).max(3000),
  projects: z.string().trim().max(4000).optional().or(z.literal("")),
  jobDescription: z.string().trim().max(6000).optional().or(z.literal("")),
});

export type AtsResumeInput = z.infer<typeof Input>;

export interface AtsResumeOutput {
  resume: {
    summary: string;
    skills: string[];
    experience: { company: string; role: string; period: string; bullets: string[] }[];
    education: { school: string; degree: string; period: string; details?: string }[];
    projects: { name: string; description: string; tech?: string }[];
  };
  atsScore: {
    score: number;
    strengths: string[];
    improvements: string[];
    keywords: string[];
  };
  coverLetter: string;
}

function stripFences(t: string) {
  return t
    .replace(/^\s*```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

export const generateAtsResume = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }): Promise<AtsResumeOutput> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI is not configured.");

    const gateway = createLovableAiGatewayProvider(key);

    const system = `You are an expert ATS (Applicant Tracking System) resume writer and career coach.
Return ONLY valid JSON matching this TypeScript type — no prose, no markdown fences:

{
  "resume": {
    "summary": string,
    "skills": string[],
    "experience": { "company": string, "role": string, "period": string, "bullets": string[] }[],
    "education": { "school": string, "degree": string, "period": string, "details"?: string }[],
    "projects": { "name": string, "description": string, "tech"?: string }[]
  },
  "atsScore": {
    "score": number,           // 0-100, realistic ATS match for the target role
    "strengths": string[],     // 3-6 items
    "improvements": string[],  // 3-6 actionable items
    "keywords": string[]       // 8-15 keywords the resume should emphasize
  },
  "coverLetter": string        // 200-350 words, plain text, addressed to "Hiring Manager"
}

Rules:
- Use strong action verbs and quantified achievements in bullets.
- Keep summary under 60 words.
- Tailor everything to the target role (and job description if provided).
- Do not invent employers, degrees, or dates that contradict the user's input.`;

    const user = `Target role: ${data.targetRole}

Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone || "—"}
Location: ${data.location || "—"}

Skills: ${data.skills}

Experience:
${data.experience}

Education:
${data.education}

Projects:
${data.projects || "—"}

Job description (optional):
${data.jobDescription || "—"}

Return JSON only.`;

    const { text } = await generateText({
      model: gateway("openai/gpt-5-mini"),
      system,
      prompt: user,
    });

    let parsed: AtsResumeOutput;
    try {
      parsed = JSON.parse(stripFences(text));
    } catch {
      const m = text.match(/\{[\s\S]*\}$/);
      if (!m) throw new Error("AI returned invalid JSON.");
      parsed = JSON.parse(m[0]);
    }
    return parsed;
  });
