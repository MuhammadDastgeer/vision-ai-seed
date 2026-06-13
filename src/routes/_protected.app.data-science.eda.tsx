import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { TaskRunner, type DSField } from "@/components/data-science/task-runner";

export const Route = createFileRoute("/_protected/app/data-science/eda")({
  component: EdaPage,
});

const fields: DSField[] = [
  { name: "name", label: "Dataset name", type: "text", placeholder: "orders_2024", required: true },
  { name: "domain", label: "Domain", type: "text", placeholder: "E-commerce" },
  { name: "rows", label: "Approx. rows", type: "number", placeholder: "100000" },
  {
    name: "columns",
    label: "Columns (name:type, comma separated)",
    type: "textarea",
    rows: 4,
    placeholder: "id:int, customer:string, total:float, status:string, created_at:datetime",
    required: true,
  },
  {
    name: "goals",
    label: "Goals / hypotheses",
    type: "textarea",
    rows: 3,
    placeholder: "Find seasonality, top customers, drivers of refunds.",
  },
];

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  domain: z.string().trim().max(120).optional().or(z.literal("")),
  rows: z.string().trim().max(20).optional().or(z.literal("")),
  columns: z.string().trim().min(3).max(3000),
  goals: z.string().trim().max(2000).optional().or(z.literal("")),
});

function EdaPage() {
  return (
    <TaskRunner
      task="eda"
      title="EDA Analyzer"
      description="Generate a structured EDA report with snippets you can run."
      fields={fields}
      schema={schema}
      exportExt="md"
    />
  );
}
