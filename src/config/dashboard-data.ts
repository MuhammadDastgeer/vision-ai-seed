import { FolderKanban, Sparkles, Bot, FileText, BarChart3, Workflow } from "lucide-react";

export type Workspace = {
  id: string;
  name: string;
  description: string;
  members: number;
  projects: number;
  color: string;
  icon: typeof FolderKanban;
};

export type Project = {
  id: string;
  name: string;
  workspace: string;
  updatedAt: string;
  status: "active" | "draft" | "archived";
  progress: number;
};

export type HistoryItem = {
  id: string;
  action: string;
  target: string;
  at: string;
};

export const workspaces: Workspace[] = [
  { id: "ws-1", name: "Generative AI", description: "LLM apps, prompts, agents.", members: 12, projects: 8, color: "from-violet-500/20 to-fuchsia-500/20", icon: Sparkles },
  { id: "ws-2", name: "Data Science", description: "Notebooks and pipelines.", members: 7, projects: 14, color: "from-sky-500/20 to-cyan-500/20", icon: BarChart3 },
  { id: "ws-3", name: "Agentic AI", description: "Autonomous workflows.", members: 5, projects: 4, color: "from-emerald-500/20 to-teal-500/20", icon: Bot },
  { id: "ws-4", name: "Document AI", description: "Extraction & OCR pipelines.", members: 9, projects: 6, color: "from-amber-500/20 to-orange-500/20", icon: FileText },
  { id: "ws-5", name: "Automation", description: "Triggers & integrations.", members: 4, projects: 11, color: "from-rose-500/20 to-pink-500/20", icon: Workflow },
  { id: "ws-6", name: "Internal Tools", description: "Ops & admin dashboards.", members: 3, projects: 5, color: "from-slate-500/20 to-zinc-500/20", icon: FolderKanban },
];

export const recentProjects: Project[] = [
  { id: "p-1", name: "Sales Copilot v2", workspace: "Generative AI", updatedAt: "2h ago", status: "active", progress: 72 },
  { id: "p-2", name: "Churn Prediction", workspace: "Data Science", updatedAt: "5h ago", status: "active", progress: 48 },
  { id: "p-3", name: "Invoice Extractor", workspace: "Document AI", updatedAt: "Yesterday", status: "draft", progress: 22 },
  { id: "p-4", name: "Lead Router Agent", workspace: "Agentic AI", updatedAt: "2d ago", status: "active", progress: 91 },
  { id: "p-5", name: "Onboarding Bot", workspace: "Generative AI", updatedAt: "3d ago", status: "archived", progress: 100 },
];

export const savedProjects: Project[] = [
  { id: "s-1", name: "RAG Knowledge Base", workspace: "Generative AI", updatedAt: "Last week", status: "active", progress: 64 },
  { id: "s-2", name: "Anomaly Monitor", workspace: "Data Science", updatedAt: "Last week", status: "active", progress: 30 },
  { id: "s-3", name: "Contract Reviewer", workspace: "Document AI", updatedAt: "2 weeks ago", status: "draft", progress: 12 },
];

export const history: HistoryItem[] = [
  { id: "h-1", action: "Deployed", target: "Sales Copilot v2", at: "12 min ago" },
  { id: "h-2", action: "Created", target: "Invoice Extractor", at: "1h ago" },
  { id: "h-3", action: "Commented on", target: "Churn Prediction", at: "3h ago" },
  { id: "h-4", action: "Archived", target: "Onboarding Bot", at: "Yesterday" },
  { id: "h-5", action: "Invited 2 members to", target: "Agentic AI", at: "2d ago" },
  { id: "h-6", action: "Renamed", target: "Lead Router Agent", at: "3d ago" },
];

export type Notification = { id: string; title: string; body: string; at: string; unread: boolean };

export const notifications: Notification[] = [
  { id: "n-1", title: "Deployment succeeded", body: "Sales Copilot v2 is live.", at: "2m", unread: true },
  { id: "n-2", title: "New comment", body: "Ava replied on Churn Prediction.", at: "1h", unread: true },
  { id: "n-3", title: "Quota at 80%", body: "Generative AI workspace tokens.", at: "4h", unread: true },
  { id: "n-4", title: "Member joined", body: "Marcus joined Document AI.", at: "1d", unread: false },
];
