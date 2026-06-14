import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { DLTaskRunner, type DLField } from "@/components/deep-learning/dl-task-runner";

export const Route = createFileRoute("/_protected/app/deep-learning/lstm-builder")({
  component: LSTMBuilderPage,
});

const fields: DLField[] = [
  { name: "task", label: "Task", type: "textarea", rows: 2, required: true,
    placeholder: "Forecast next-hour energy demand from past 168h." },
  { name: "dataset", label: "Dataset description / sample", type: "textarea", rows: 5, required: true,
    placeholder: "Upload CSV above, or paste schema and a few rows." },
  { name: "sequenceType", label: "Sequence type", type: "select",
    options: ["text", "time-series", "audio features", "event log"], defaultValue: "time-series" },
  { name: "seqLen", label: "Sequence length / window", type: "text", placeholder: "168" },
  { name: "featureDim", label: "Feature / vocab dim", type: "text", placeholder: "8" },
  { name: "framework", label: "Framework", type: "select",
    options: ["PyTorch", "TensorFlow/Keras"], defaultValue: "PyTorch" },
  { name: "constraints", label: "Constraints", type: "textarea", rows: 2,
    placeholder: "Streaming inference, small footprint…" },
];

const schema = z.object({
  task: z.string().trim().min(5).max(500),
  dataset: z.string().trim().min(10).max(8000),
  sequenceType: z.string().trim().max(40).optional().or(z.literal("")),
  seqLen: z.string().trim().max(20).optional().or(z.literal("")),
  featureDim: z.string().trim().max(20).optional().or(z.literal("")),
  framework: z.string().trim().max(40).optional().or(z.literal("")),
  constraints: z.string().trim().max(1000).optional().or(z.literal("")),
});

function LSTMBuilderPage() {
  return (
    <DLTaskRunner
      task="lstm"
      title="LSTM Builder"
      description="Sequence models for text, time-series, and signals."
      datasetFieldName="dataset"
      fields={fields}
      schema={schema}
    />
  );
}
