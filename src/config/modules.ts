import {
  Wrench,
  BarChart3,
  Brain,
  Network,
  Sparkles,
  Bot,
  FileText,
  Code2,
  Globe,
  Workflow,
  AppWindow,
  Cpu,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";

export interface ModuleDef {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const DASHBOARD: ModuleDef = {
  slug: "",
  title: "Dashboard",
  description: "Overview of your AI Studio workspace.",
  icon: LayoutDashboard,
};

export const MODULES: ModuleDef[] = [
  { slug: "core-tools", title: "Core Tools", description: "Foundational utilities powering every workflow.", icon: Wrench },
  { slug: "data-science", title: "Data Science", description: "Explore, transform, and visualize datasets.", icon: BarChart3 },
  { slug: "machine-learning", title: "Machine Learning", description: "Train, evaluate, and deploy classical ML models.", icon: Brain },
  { slug: "deep-learning", title: "Deep Learning", description: "Build neural networks at scale.", icon: Network },
  { slug: "generative-ai", title: "Generative AI", description: "Text, image, audio and video generation.", icon: Sparkles },
  { slug: "agentic-ai", title: "Agentic AI", description: "Autonomous multi-agent workflows.", icon: Bot },
  { slug: "document-ai", title: "Document AI", description: "Parse, extract, and reason over documents.", icon: FileText },
  { slug: "developer-tools", title: "Developer Tools", description: "Code intelligence and productivity helpers.", icon: Code2 },
  { slug: "web-scraping", title: "Web Scraping", description: "Structured data extraction at scale.", icon: Globe },
  { slug: "automation", title: "Automation", description: "No-code automations and triggers.", icon: Workflow },
  { slug: "app-development", title: "App Development", description: "Ship full-stack apps faster.", icon: AppWindow },
  { slug: "mlops", title: "MLOps", description: "Pipelines, registries, monitoring.", icon: Cpu },
];

export const ALL_MODULES = [DASHBOARD, ...MODULES];
