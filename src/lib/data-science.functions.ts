import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const Input = z.object({
  task: z.enum(["data-cleaning", "eda", "visualization", "sql-generator"]),
  payload: z.record(z.string(), z.any()),
});

function buildPrompt(task: string, p: Record<string, any>): { system: string; user: string } {
  switch (task) {
    case "data-cleaning":
      return {
        system:
          "You are a senior data engineer. Given a dataset description and cleaning goals, produce a clear, runnable cleaning plan AND a complete Python (pandas) script. Output Markdown with sections: ## Plan, ## Python Script (```python code), ## Notes & Edge Cases.",
        user: `Dataset description:
${p.description}

Known issues:
${p.issues || "(infer common issues)"}

Target outcome:
${p.outcome || "clean, analysis-ready dataframe"}

Language: ${p.language || "Python (pandas)"}`,
      };
    case "eda":
      return {
        system:
          "You are an expert data analyst. Generate a thorough Exploratory Data Analysis report in Markdown. Include: ## Summary, ## Suggested Questions, ## Univariate Analysis, ## Bivariate / Correlation, ## Anomalies & Missing Data, ## Recommended Next Steps, ## Python Snippets (```python code) the user can run with pandas/seaborn.",
        user: `Dataset name: ${p.name}
Domain: ${p.domain || "general"}
Rows: ${p.rows || "unknown"}
Columns (name:type, comma separated):
${p.columns}

Goals / hypotheses:
${p.goals || "discover patterns and data quality issues"}`,
      };
    case "visualization":
      return {
        system:
          "You are a data visualization expert. Recommend the best chart(s) for the user's goal and produce ready-to-run code. Output Markdown sections: ## Recommended Chart, ## Why, ## Python Code (matplotlib/seaborn in ```python), ## Plotly Code (```python), ## Design Tips.",
        user: `Goal: ${p.goal}
Data shape:
${p.data}

Audience: ${p.audience || "general"}
Style: ${p.style || "clean, modern, accessible"}
Tool preference: ${p.tool || "any (provide both matplotlib and plotly)"}`,
      };
    case "sql-generator":
      return {
        system:
          "You are an expert SQL engineer. Generate correct, performant SQL for the requested dialect. Output Markdown with: ## Query (```sql code block), ## Explanation, ## Assumptions, ## Performance Notes. Use clear formatting and CTEs when appropriate.",
        user: `Database dialect: ${p.dialect || "PostgreSQL"}
Schema (tables and columns):
${p.schema}

Request (natural language):
${p.request}

Constraints: ${p.constraints || "none"}`,
      };
    default:
      return { system: "You are a helpful assistant.", user: JSON.stringify(p) };
  }
}

export const runDataScienceTask = createServerFn({ method: "POST" })
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
