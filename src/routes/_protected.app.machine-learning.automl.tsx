import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { MLTaskRunner, type MLField } from "@/components/machine-learning/ml-task-runner";

export const Route = createFileRoute("/_protected/app/machine-learning/automl")({
  component: AutoMLPage,
});

const fields: MLField[] = [
  { name: "dataset", label: "Dataset description / sample", type: "textarea", rows: 6, required: true,
    placeholder: "Upload a file above or paste a CSV sample." },
  { name: "target", label: "Target column", type: "text", required: true, placeholder: "price" },
  { name: "taskType", label: "Task type", type: "select",
    options: ["auto", "classification", "regression", "time-series"],
    defaultValue: "auto" },
  { name: "metric", label: "Optimize metric", type: "select",
    options: ["auto", "accuracy", "f1", "roc_auc", "rmse", "mae", "r2"],
    defaultValue: "auto" },
  { name: "framework", label: "AutoML framework", type: "select",
    options: ["FLAML", "auto-sklearn", "Optuna + sklearn", "H2O AutoML"],
    defaultValue: "FLAML" },
  { name: "budget", label: "Time budget", type: "text", placeholder: "30 minutes", defaultValue: "30 minutes" },
];

const schema = z.object({
  dataset: z.string().trim().min(10).max(8000),
  target: z.string().trim().min(1).max(120),
  taskType: z.string().trim().max(40).optional().or(z.literal("")),
  metric: z.string().trim().max(40).optional().or(z.literal("")),
  framework: z.string().trim().max(40).optional().or(z.literal("")),
  budget: z.string().trim().max(80).optional().or(z.literal("")),
});

function AutoMLPage() {
  return (
    <MLTaskRunner
      task="automl"
      title="AutoML"
      description="Search algorithms and hyperparameters automatically."
      datasetFieldName="dataset"
      fields={fields}
      schema={schema}
    />
  );
}
