import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { DLTaskRunner, type DLField } from "@/components/deep-learning/dl-task-runner";

export const Route = createFileRoute("/_protected/app/deep-learning/computer-vision")({
  component: ComputerVisionPage,
});

const fields: DLField[] = [
  { name: "cvTask", label: "CV task", type: "select", required: true,
    options: ["classification", "object detection", "semantic segmentation",
      "instance segmentation", "keypoint / pose", "OCR", "depth estimation"],
    defaultValue: "object detection" },
  { name: "dataset", label: "Dataset description / sample", type: "textarea", rows: 5, required: true,
    placeholder: "Upload sample above, or describe COCO/YOLO/Pascal format, classes…" },
  { name: "imageSpecs", label: "Image specs", type: "text",
    placeholder: "RGB, 1280x720, variable aspect ratio" },
  { name: "outputs", label: "Classes / outputs", type: "text", placeholder: "80 COCO classes" },
  { name: "backbone", label: "Backbone preference", type: "text",
    placeholder: "e.g. YOLOv8n, ResNet50, ViT-B/16 (blank = recommend)" },
  { name: "framework", label: "Framework", type: "select",
    options: ["PyTorch", "Ultralytics YOLO", "TensorFlow/Keras", "MMDetection"],
    defaultValue: "PyTorch" },
  { name: "constraints", label: "Constraints", type: "textarea", rows: 2,
    placeholder: "Edge inference, ONNX export, mAP > 0.5…" },
];

const schema = z.object({
  cvTask: z.string().trim().min(3).max(60),
  dataset: z.string().trim().min(10).max(8000),
  imageSpecs: z.string().trim().max(200).optional().or(z.literal("")),
  outputs: z.string().trim().max(120).optional().or(z.literal("")),
  backbone: z.string().trim().max(120).optional().or(z.literal("")),
  framework: z.string().trim().max(60).optional().or(z.literal("")),
  constraints: z.string().trim().max(1000).optional().or(z.literal("")),
});

function ComputerVisionPage() {
  return (
    <DLTaskRunner
      task="computer-vision"
      title="Computer Vision Builder"
      description="Build modern CV pipelines with training and deployment notes."
      datasetFieldName="dataset"
      acceptFiles=".csv,.json,.txt,image/*"
      fields={fields}
      schema={schema}
    />
  );
}
