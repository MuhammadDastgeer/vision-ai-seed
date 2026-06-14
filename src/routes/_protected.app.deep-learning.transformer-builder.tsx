import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { DLTaskRunner, type DLField } from "@/components/deep-learning/dl-task-runner";

export const Route = createFileRoute("/_protected/app/deep-learning/transformer-builder")({
  component: TransformerBuilderPage,
});

const fields: DLField[] = [
  { name: "task", label: "Task", type: "textarea", rows: 2, required: true,
    placeholder: "Multi-label classification of support tickets." },
  { name: "dataset", label: "Dataset description / sample", type: "textarea", rows: 5, required: true,
    placeholder: "Upload sample above, or paste schema / example rows." },
  { name: "modality", label: "Modality", type: "select",
    options: ["text", "vision (ViT)", "audio", "multimodal"], defaultValue: "text" },
  { name: "seqLen", label: "Sequence length", type: "text", defaultValue: "512" },
  { name: "outputs", label: "Outputs / target", type: "text", placeholder: "12 labels" },
  { name: "pretrained", label: "Pretrained backbone", type: "text",
    placeholder: "e.g. distilbert-base-uncased (leave blank for from-scratch)" },
  { name: "framework", label: "Framework", type: "select",
    options: ["PyTorch + HuggingFace", "PyTorch (raw)", "TensorFlow/Keras"],
    defaultValue: "PyTorch + HuggingFace" },
  { name: "constraints", label: "Constraints", type: "textarea", rows: 2,
    placeholder: "Single-GPU, <16GB VRAM, fast inference…" },
];

const schema = z.object({
  task: z.string().trim().min(5).max(500),
  dataset: z.string().trim().min(10).max(8000),
  modality: z.string().trim().max(40).optional().or(z.literal("")),
  seqLen: z.string().trim().max(20).optional().or(z.literal("")),
  outputs: z.string().trim().max(80).optional().or(z.literal("")),
  pretrained: z.string().trim().max(120).optional().or(z.literal("")),
  framework: z.string().trim().max(60).optional().or(z.literal("")),
  constraints: z.string().trim().max(1000).optional().or(z.literal("")),
});

function TransformerBuilderPage() {
  return (
    <DLTaskRunner
      task="transformer"
      title="Transformer Builder"
      description="Design transformers — from scratch or with pretrained backbones."
      datasetFieldName="dataset"
      fields={fields}
      schema={schema}
    />
  );
}
