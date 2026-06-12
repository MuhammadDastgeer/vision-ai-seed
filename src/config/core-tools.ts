import {
  FileText,
  Sparkles,
  Map as MapIcon,
  Database,
  type LucideIcon,
} from "lucide-react";
import { z, type ZodTypeAny } from "zod";

export type FieldType = "text" | "textarea" | "number" | "select";

export interface ToolField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  rows?: number;
}

export interface ToolDef {
  slug: "cv-generator" | "prompt-builder" | "roadmap-builder" | "dataset-creator";
  title: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  outputFormat: "markdown" | "json";
  exportExt: "md" | "json";
  fields: ToolField[];
  schema: ZodTypeAny;
}

export const CORE_TOOLS: ToolDef[] = [
  {
    slug: "cv-generator",
    title: "CV Generator",
    tagline: "Polished, ATS-friendly resumes in seconds.",
    description: "Turn raw career details into a clean, recruiter-ready CV in Markdown.",
    icon: FileText,
    outputFormat: "markdown",
    exportExt: "md",
    fields: [
      { name: "fullName", label: "Full name", type: "text", placeholder: "Ada Lovelace", required: true },
      { name: "email", label: "Email", type: "text", placeholder: "ada@example.com", required: true },
      { name: "phone", label: "Phone", type: "text", placeholder: "+1 555 123 4567" },
      { name: "location", label: "Location", type: "text", placeholder: "Berlin, Germany" },
      { name: "targetRole", label: "Target role", type: "text", placeholder: "Senior ML Engineer", required: true },
      { name: "years", label: "Years of experience", type: "number", placeholder: "5", required: true },
      { name: "skills", label: "Skills (comma separated)", type: "textarea", rows: 3, placeholder: "Python, PyTorch, SQL, AWS", required: true },
      { name: "experience", label: "Experience (one role per line)", type: "textarea", rows: 6, placeholder: "Company — Role — 2021–Present\n- Built X that did Y", required: true },
      { name: "education", label: "Education", type: "textarea", rows: 3, placeholder: "B.Sc. Computer Science, MIT, 2019", required: true },
      { name: "extras", label: "Other (projects, awards)", type: "textarea", rows: 3 },
    ],
    schema: z.object({
      fullName: z.string().trim().min(2).max(100),
      email: z.string().trim().email().max(255),
      phone: z.string().trim().max(40).optional().or(z.literal("")),
      location: z.string().trim().max(100).optional().or(z.literal("")),
      targetRole: z.string().trim().min(2).max(120),
      years: z.coerce.number().min(0).max(60),
      skills: z.string().trim().min(2).max(2000),
      experience: z.string().trim().min(10).max(5000),
      education: z.string().trim().min(2).max(2000),
      extras: z.string().trim().max(2000).optional().or(z.literal("")),
    }),
  },
  {
    slug: "prompt-builder",
    title: "Prompt Builder",
    tagline: "Engineer-grade prompts, fully structured.",
    description: "Compose reusable, well-structured LLM prompts with clear sections.",
    icon: Sparkles,
    outputFormat: "markdown",
    exportExt: "md",
    fields: [
      { name: "goal", label: "Goal", type: "textarea", rows: 3, placeholder: "Summarize legal contracts for non-lawyers…", required: true },
      { name: "model", label: "Target model", type: "select", options: ["any", "gpt-5", "gemini-2.5-pro", "claude-sonnet"] },
      { name: "audience", label: "Audience", type: "text", placeholder: "Product managers" },
      { name: "tone", label: "Tone", type: "select", options: ["neutral", "friendly", "formal", "playful", "expert"] },
      { name: "outputFormat", label: "Output format", type: "select", options: ["markdown", "json", "bullet list", "table", "plain text"] },
      { name: "constraints", label: "Constraints", type: "textarea", rows: 3, placeholder: "No legal advice. Max 200 words." },
      { name: "context", label: "Extra context", type: "textarea", rows: 3 },
    ],
    schema: z.object({
      goal: z.string().trim().min(5).max(2000),
      model: z.string().trim().max(60).optional().or(z.literal("")),
      audience: z.string().trim().max(120).optional().or(z.literal("")),
      tone: z.string().trim().max(40).optional().or(z.literal("")),
      outputFormat: z.string().trim().max(40).optional().or(z.literal("")),
      constraints: z.string().trim().max(2000).optional().or(z.literal("")),
      context: z.string().trim().max(2000).optional().or(z.literal("")),
    }),
  },
  {
    slug: "roadmap-builder",
    title: "Roadmap Builder",
    tagline: "Personalized learning paths, week by week.",
    description: "Generate a phased learning roadmap with milestones and resources.",
    icon: MapIcon,
    outputFormat: "markdown",
    exportExt: "md",
    fields: [
      { name: "topic", label: "Topic / Goal", type: "text", placeholder: "Become a Machine Learning Engineer", required: true },
      { name: "level", label: "Current level", type: "select", options: ["beginner", "intermediate", "advanced"], required: true },
      { name: "target", label: "Target level", type: "select", options: ["intermediate", "advanced", "expert"], required: true },
      { name: "hoursPerWeek", label: "Hours per week", type: "number", placeholder: "10", required: true },
      { name: "durationWeeks", label: "Duration (weeks)", type: "number", placeholder: "12", required: true },
      { name: "resources", label: "Preferred resources", type: "text", placeholder: "Books, YouTube, courses" },
      { name: "notes", label: "Notes", type: "textarea", rows: 3 },
    ],
    schema: z.object({
      topic: z.string().trim().min(3).max(200),
      level: z.string().trim().min(1).max(40),
      target: z.string().trim().min(1).max(40),
      hoursPerWeek: z.coerce.number().min(1).max(80),
      durationWeeks: z.coerce.number().min(1).max(104),
      resources: z.string().trim().max(200).optional().or(z.literal("")),
      notes: z.string().trim().max(2000).optional().or(z.literal("")),
    }),
  },
  {
    slug: "dataset-creator",
    title: "Dataset Creator",
    tagline: "Synthetic datasets on demand.",
    description: "Generate realistic synthetic JSON datasets for prototypes and tests.",
    icon: Database,
    outputFormat: "json",
    exportExt: "json",
    fields: [
      { name: "domain", label: "Domain", type: "text", placeholder: "E-commerce orders", required: true },
      { name: "rows", label: "Number of rows", type: "number", placeholder: "20", required: true },
      { name: "fields", label: "Fields (name:type, comma separated)", type: "textarea", rows: 3, placeholder: "id:string, customer:string, total:number, status:string", required: true },
      { name: "constraints", label: "Constraints", type: "textarea", rows: 3, placeholder: "totals between 10 and 500; status in [pending, shipped, delivered]" },
    ],
    schema: z.object({
      domain: z.string().trim().min(2).max(120),
      rows: z.coerce.number().min(1).max(200),
      fields: z.string().trim().min(3).max(1000),
      constraints: z.string().trim().max(2000).optional().or(z.literal("")),
    }),
  },
];

export function getCoreTool(slug: string): ToolDef | undefined {
  return CORE_TOOLS.find((t) => t.slug === slug);
}
