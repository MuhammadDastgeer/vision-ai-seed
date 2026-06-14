import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { MLTaskRunner, type MLField } from "@/components/machine-learning/ml-task-runner";

export const Route = createFileRoute("/_protected/app/machine-learning/model-evaluator")({
  component: ModelEvaluatorPage,
});

const fields: MLField[] = [
  { name: "model", label: "Model description", type: "textarea", rows: 3, required: true,
    placeholder: "RandomForestClassifier(n_estimators=300, max_depth=12) trained on…" },
  { name: "dataset", label: "Dataset / predictions sample", type: "textarea", rows: 6, required: true,
    placeholder: "Upload a file above or paste y_true / y_pred sample rows." },
  { name: "taskType", label: "Task type", type: "select",
    options: ["classification", "regression", "ranking", "clustering"],
    defaultValue: "classification" },
  { name: "columns", label: "Prediction columns", type: "text", placeholder: "y_true, y_pred, y_proba" },
  { name: "goals", label: "Evaluation goals", type: "textarea", rows: 2,
    placeholder: "Diagnose where the model under-performs and propose fixes." },
];

const schema = z.object({
  model: z.string().trim().min(5).max(1500),
  dataset: z.string().trim().min(10).max(8000),
  taskType: z.string().trim().max(40).optional().or(z.literal("")),
  columns: z.string().trim().max(200).optional().or(z.literal("")),
  goals: z.string().trim().max(1000).optional().or(z.literal("")),
});

function ModelEvaluatorPage() {
  return (
    <MLTaskRunner
      task="model-evaluator"
      title="Model Evaluator"
      description="Generate metrics, error analysis & a metrics chart."
      datasetFieldName="dataset"
      fields={fields}
      schema={schema}
    />
  );
}
