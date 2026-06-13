import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { TaskRunner, type DSField } from "@/components/data-science/task-runner";

export const Route = createFileRoute("/_protected/app/data-science/visualization")({
  component: VisualizationPage,
});

const fields: DSField[] = [
  {
    name: "goal",
    label: "What do you want to show?",
    type: "textarea",
    rows: 3,
    placeholder: "Monthly revenue trend by region with annotations on big drops.",
    required: true,
  },
  {
    name: "data",
    label: "Data shape (columns / sample)",
    type: "textarea",
    rows: 4,
    placeholder: "month:date, region:string, revenue:float\nor a few sample rows",
    required: true,
  },
  { name: "audience", label: "Audience", type: "text", placeholder: "Executives" },
  {
    name: "style",
    label: "Style",
    type: "select",
    options: ["clean, modern, accessible", "minimal", "dashboard-ready", "presentation"],
    defaultValue: "clean, modern, accessible",
  },
  {
    name: "tool",
    label: "Preferred tool",
    type: "select",
    options: ["any (both matplotlib and plotly)", "matplotlib", "seaborn", "plotly", "altair"],
    defaultValue: "any (both matplotlib and plotly)",
  },
];

const schema = z.object({
  goal: z.string().trim().min(5).max(2000),
  data: z.string().trim().min(3).max(3000),
  audience: z.string().trim().max(120).optional().or(z.literal("")),
  style: z.string().trim().max(120).optional().or(z.literal("")),
  tool: z.string().trim().max(120).optional().or(z.literal("")),
});

function VisualizationPage() {
  return (
    <TaskRunner
      task="visualization"
      title="Visualization Builder"
      description="Get chart recommendations and ready-to-run plotting code."
      fields={fields}
      schema={schema}
      exportExt="md"
    />
  );
}
