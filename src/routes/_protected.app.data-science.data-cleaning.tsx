import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { TaskRunner, type DSField } from "@/components/data-science/task-runner";

export const Route = createFileRoute("/_protected/app/data-science/data-cleaning")({
  component: DataCleaningPage,
});

const fields: DSField[] = [
  {
    name: "description",
    label: "Dataset description",
    type: "textarea",
    rows: 4,
    placeholder: "E-commerce orders CSV with id, customer_id, total, status, created_at…",
    required: true,
  },
  {
    name: "issues",
    label: "Known issues",
    type: "textarea",
    rows: 3,
    placeholder: "Missing totals, duplicate ids, inconsistent date formats…",
  },
  {
    name: "outcome",
    label: "Target outcome",
    type: "textarea",
    rows: 2,
    placeholder: "Clean, deduplicated table ready for monthly revenue analysis.",
  },
  {
    name: "language",
    label: "Language / library",
    type: "select",
    options: ["Python (pandas)", "Python (polars)", "R (tidyverse)", "SQL"],
    defaultValue: "Python (pandas)",
  },
];

const schema = z.object({
  description: z.string().trim().min(10).max(3000),
  issues: z.string().trim().max(2000).optional().or(z.literal("")),
  outcome: z.string().trim().max(1000).optional().or(z.literal("")),
  language: z.string().trim().max(60).optional().or(z.literal("")),
});

function DataCleaningPage() {
  return (
    <TaskRunner
      task="data-cleaning"
      title="Data Cleaning"
      description="Describe your dataset to get a cleaning plan and runnable code."
      fields={fields}
      schema={schema}
      exportExt="md"
    />
  );
}
