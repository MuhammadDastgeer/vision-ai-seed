import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const Input = z.object({
  task: z.enum(["ml-builder", "automl", "model-evaluator", "feature-engineering"]),
  payload: z.record(z.string(), z.any()),
});

function buildPrompt(task: string, p: Record<string, any>): { system: string; user: string } {
  const metricsHint =
    "If relevant, also include a fenced code block labeled `metrics-json` containing a JSON object of shape { \"metrics\": [{\"name\": string, \"value\": number}, ...] } so the UI can chart it.";

  switch (task) {
    case "ml-builder":
      return {
        system: `You are a senior ML engineer. Given a problem and dataset, produce a complete end-to-end scikit-learn (or specified library) training pipeline. Output Markdown sections: ## Problem Framing, ## Recommended Algorithms, ## Pipeline (preprocessing + model), ## Python Code (\`\`\`python), ## Training Plan, ## Evaluation Strategy, ## Risks & Caveats. ${metricsHint}`,
        user: `Problem statement: ${p.problem}
Target column: ${p.target || "(unspecified)"}
Task type: ${p.taskType || "auto-detect"}
Dataset description / sample rows:
${p.dataset}

Library preference: ${p.library || "scikit-learn"}
Constraints: ${p.constraints || "none"}`,
      };
    case "automl":
      return {
        system: `You are an AutoML specialist. Recommend the best AutoML approach and write runnable code that searches algorithms and hyperparameters. Output Markdown: ## Strategy, ## Search Space, ## Code (\`\`\`python using auto-sklearn / FLAML / Optuna+sklearn as appropriate), ## Expected Leaderboard (table), ## Deployment Notes. ${metricsHint} Use the metrics block to show expected score per candidate model.`,
        user: `Dataset: ${p.dataset}
Target: ${p.target}
Task type: ${p.taskType || "auto"}
Metric to optimize: ${p.metric || "auto"}
Time budget: ${p.budget || "30 minutes"}
Framework: ${p.framework || "FLAML"}`,
      };
    case "model-evaluator":
      return {
        system: `You are an ML evaluation expert. Given a model and dataset, generate a thorough evaluation report. Output Markdown: ## Summary, ## Metrics (table), ## Confusion / Residual Analysis, ## Error Patterns, ## Fairness & Robustness, ## Python Code (\`\`\`python), ## Recommendations. ${metricsHint} Always include the metrics block with the headline metrics.`,
        user: `Model: ${p.model}
Task type: ${p.taskType || "classification"}
Dataset description: ${p.dataset}
Available predictions / labels columns: ${p.columns || "y_true, y_pred"}
Goals: ${p.goals || "diagnose weaknesses"}`,
      };
    case "feature-engineering":
      return {
        system: `You are a feature engineering expert. Propose impactful features and produce runnable code. Output Markdown: ## Feature Ideas (table: name, rationale, formula), ## Encoding & Scaling Plan, ## Python Code (\`\`\`python using pandas + sklearn), ## Validation Plan, ## Watchouts (leakage etc.). ${metricsHint} Use the metrics block to estimate expected lift per feature group.`,
        user: `Dataset: ${p.dataset}
Target: ${p.target}
Task type: ${p.taskType || "auto"}
Known columns: ${p.columns}
Goals: ${p.goals || "improve model accuracy"}`,
      };
    default:
      return { system: "You are a helpful ML assistant.", user: JSON.stringify(p) };
  }
}

export const runMLTask = createServerFn({ method: "POST" })
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
