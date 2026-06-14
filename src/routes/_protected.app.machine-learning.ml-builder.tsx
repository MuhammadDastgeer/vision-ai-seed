import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { MLTaskRunner, type MLField } from "@/components/machine-learning/ml-task-runner";

export const Route = createFileRoute("/_protected/app/machine-learning/ml-builder")({
  component: MLBuilderPage,
});

const fields: MLField[] = [
  { name: "problem", label: "Problem statement", type: "textarea", rows: 3, required: true,
    placeholder: "Predict customer churn within 30 days." },
  { name: "dataset", label: "Dataset description / sample", type: "textarea", rows: 6, required: true,
    placeholder: "Upload a file above or paste a CSV sample / column list." },
  { name: "target", label: "Target column", type: "text", placeholder: "churned" },
  { name: "taskType", label: "Task type", type: "select",
    options: ["classification", "regression", "clustering", "time-series", "ranking"],
    defaultValue: "classification" },
  { name: "library", label: "Library", type: "select",
    options: ["scikit-learn", "xgboost", "lightgbm", "pytorch", "tensorflow"],
    defaultValue: "scikit-learn" },
  { name: "constraints", label: "Constraints", type: "textarea", rows: 2,
    placeholder: "Latency budget, interpretability, data size…" },
];

const schema = z.object({
  problem: z.string().trim().min(8).max(1000),
  dataset: z.string().trim().min(10).max(8000),
  target: z.string().trim().max(120).optional().or(z.literal("")),
  taskType: z.string().trim().max(40).optional().or(z.literal("")),
  library: z.string().trim().max(40).optional().or(z.literal("")),
  constraints: z.string().trim().max(1000).optional().or(z.literal("")),
});

function MLBuilderPage() {
  return (
    <MLTaskRunner
      task="ml-builder"
      title="ML Builder"
      description="Describe your problem & dataset to get a full training pipeline."
      datasetFieldName="dataset"
      fields={fields}
      schema={schema}
    />
  );
}
