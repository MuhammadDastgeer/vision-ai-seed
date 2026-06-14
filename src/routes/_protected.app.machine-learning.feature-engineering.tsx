import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { MLTaskRunner, type MLField } from "@/components/machine-learning/ml-task-runner";

export const Route = createFileRoute("/_protected/app/machine-learning/feature-engineering")({
  component: FeatureEngineeringPage,
});

const fields: MLField[] = [
  { name: "dataset", label: "Dataset description / sample", type: "textarea", rows: 6, required: true,
    placeholder: "Upload a file above or paste CSV sample." },
  { name: "target", label: "Target column", type: "text", required: true, placeholder: "conversion" },
  { name: "columns", label: "Available columns (name: type)", type: "textarea", rows: 3, required: true,
    placeholder: "user_id: int, signup_date: datetime, plan: str, sessions_7d: int…" },
  { name: "taskType", label: "Task type", type: "select",
    options: ["auto", "classification", "regression", "time-series"],
    defaultValue: "auto" },
  { name: "goals", label: "Goals", type: "textarea", rows: 2,
    placeholder: "Lift F1 by 3pts; capture recency & frequency patterns." },
];

const schema = z.object({
  dataset: z.string().trim().min(10).max(8000),
  target: z.string().trim().min(1).max(120),
  columns: z.string().trim().min(3).max(4000),
  taskType: z.string().trim().max(40).optional().or(z.literal("")),
  goals: z.string().trim().max(1000).optional().or(z.literal("")),
});

function FeatureEngineeringPage() {
  return (
    <MLTaskRunner
      task="feature-engineering"
      title="Feature Engineering"
      description="Propose features with code, validation plan, and lift estimates."
      datasetFieldName="dataset"
      fields={fields}
      schema={schema}
    />
  );
}
