import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const Input = z.object({
  task: z.enum(["cnn", "lstm", "transformer", "computer-vision"]),
  payload: z.record(z.string(), z.any()),
});

function buildPrompt(task: string, p: Record<string, any>): { system: string; user: string } {
  const metricsHint =
    "If applicable, include a fenced code block labeled `metrics-json` containing { \"metrics\": [{\"name\": string, \"value\": number}, ...] } with expected training metrics (e.g. accuracy, loss, F1) so the UI can chart it.";

  switch (task) {
    case "cnn":
      return {
        system: `You are a senior deep learning engineer. Design a CNN tailored to the user's task and produce complete, runnable code. Output Markdown: ## Architecture Overview, ## Layer-by-Layer Table, ## ${p.framework || "PyTorch"} Code (\`\`\`python with model, dataloader, training loop), ## Training Recipe (optimizer, lr schedule, augmentations, epochs), ## Evaluation, ## Tips & Pitfalls. ${metricsHint}`,
        user: `Task: ${p.task}
Input image shape: ${p.inputShape || "3x224x224"}
Number of classes / outputs: ${p.outputs || "(infer)"}
Dataset description: ${p.dataset}
Framework: ${p.framework || "PyTorch"}
Constraints: ${p.constraints || "none"}`,
      };
    case "lstm":
      return {
        system: `You are a sequence modeling expert. Design an LSTM (or BiLSTM/GRU if better) for the user's sequence task. Output Markdown: ## Architecture Overview, ## Sequence Pipeline (tokenization/scaling, padding, batching), ## ${p.framework || "PyTorch"} Code (\`\`\`python), ## Training Recipe, ## Evaluation, ## Tips & Pitfalls. ${metricsHint}`,
        user: `Task: ${p.task}
Sequence type: ${p.sequenceType || "text"}
Sequence length / window: ${p.seqLen || "(infer)"}
Vocab / feature dim: ${p.featureDim || "(infer)"}
Dataset description: ${p.dataset}
Framework: ${p.framework || "PyTorch"}
Constraints: ${p.constraints || "none"}`,
      };
    case "transformer":
      return {
        system: `You are a transformer architecture expert. Design a transformer (encoder/decoder/encoder-decoder as appropriate) for the user's task and produce complete code. Output Markdown: ## Architecture (depth, heads, d_model, ff_dim, positional encoding), ## Diagram (ASCII), ## ${p.framework || "PyTorch"} Code (\`\`\`python), ## Training Recipe (warmup, scheduler, label smoothing), ## Evaluation, ## Tips & Pitfalls. ${metricsHint}`,
        user: `Task: ${p.task}
Modality: ${p.modality || "text"}
Sequence length: ${p.seqLen || "512"}
Target vocab / output: ${p.outputs || "(infer)"}
Dataset description: ${p.dataset}
Framework: ${p.framework || "PyTorch"}
Use pretrained backbone: ${p.pretrained || "if useful, mention HF model id"}
Constraints: ${p.constraints || "none"}`,
      };
    case "computer-vision":
      return {
        system: `You are a computer vision expert. For the user's CV task (classification, detection, segmentation, OCR, pose, etc.), recommend the best modern approach and produce complete code. Output Markdown: ## Recommended Approach (model family + pretrained option), ## Data Pipeline (augmentations), ## ${p.framework || "PyTorch"} Code (\`\`\`python — include training and inference), ## Training Recipe, ## Evaluation Metrics, ## Deployment Notes (export to ONNX / TorchScript). ${metricsHint}`,
        user: `CV task: ${p.cvTask}
Image specs: ${p.imageSpecs || "RGB, variable size"}
Number of classes / outputs: ${p.outputs || "(infer)"}
Dataset description: ${p.dataset}
Framework: ${p.framework || "PyTorch"}
Pretrained backbone preference: ${p.backbone || "let the model decide"}
Constraints: ${p.constraints || "none"}`,
      };
    default:
      return { system: "You are a helpful deep learning assistant.", user: JSON.stringify(p) };
  }
}

export const runDeepLearningTask = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI is not configured.");

    const gateway = createLovableAiGatewayProvider(key);
    const { system, user } = buildPrompt(data.task, data.payload);

    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system,
      prompt: user,
    });

    return { output: text };
  });
