import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { DLTaskRunner, type DLField } from "@/components/deep-learning/dl-task-runner";

export const Route = createFileRoute("/_protected/app/deep-learning/cnn-builder")({
  component: CNNBuilderPage,
});

const fields: DLField[] = [
  { name: "task", label: "Task", type: "textarea", rows: 2, required: true,
    placeholder: "Image classification of plant diseases (10 classes)." },
  { name: "dataset", label: "Dataset description / sample", type: "textarea", rows: 5, required: true,
    placeholder: "Upload sample above, or describe folder structure, class balance, size…" },
  { name: "inputShape", label: "Input shape", type: "text", defaultValue: "3x224x224" },
  { name: "outputs", label: "Outputs / classes", type: "text", placeholder: "10" },
  { name: "framework", label: "Framework", type: "select",
    options: ["PyTorch", "TensorFlow/Keras", "JAX/Flax"], defaultValue: "PyTorch" },
  { name: "constraints", label: "Constraints", type: "textarea", rows: 2,
    placeholder: "Edge device, <5M params, real-time inference…" },
];

const schema = z.object({
  task: z.string().trim().min(5).max(500),
  dataset: z.string().trim().min(10).max(8000),
  inputShape: z.string().trim().max(40).optional().or(z.literal("")),
  outputs: z.string().trim().max(40).optional().or(z.literal("")),
  framework: z.string().trim().max(40).optional().or(z.literal("")),
  constraints: z.string().trim().max(1000).optional().or(z.literal("")),
});

function CNNBuilderPage() {
  return (
    <DLTaskRunner
      task="cnn"
      title="CNN Builder"
      description="Design a CNN with layer table, training recipe, and runnable code."
      datasetFieldName="dataset"
      acceptFiles=".csv,.json,.txt,image/*"
      fields={fields}
      schema={schema}
    />
  );
}
