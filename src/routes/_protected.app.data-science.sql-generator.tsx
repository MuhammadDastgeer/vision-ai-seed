import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { TaskRunner, type DSField } from "@/components/data-science/task-runner";

export const Route = createFileRoute("/_protected/app/data-science/sql-generator")({
  component: SqlGeneratorPage,
});

const fields: DSField[] = [
  {
    name: "dialect",
    label: "SQL dialect",
    type: "select",
    options: ["PostgreSQL", "MySQL", "SQLite", "BigQuery", "Snowflake", "MS SQL Server"],
    defaultValue: "PostgreSQL",
  },
  {
    name: "schema",
    label: "Schema (tables & columns)",
    type: "textarea",
    rows: 6,
    placeholder:
      "orders(id, customer_id, total, status, created_at)\ncustomers(id, name, email, country)",
    required: true,
  },
  {
    name: "request",
    label: "What do you want?",
    type: "textarea",
    rows: 4,
    placeholder: "Top 10 customers by revenue in 2024 with order count, excluding refunded.",
    required: true,
  },
  {
    name: "constraints",
    label: "Constraints",
    type: "textarea",
    rows: 2,
    placeholder: "Use CTEs; must run on read-replica; avoid window functions if possible.",
  },
];

const schema = z.object({
  dialect: z.string().trim().max(40).optional().or(z.literal("")),
  schema: z.string().trim().min(5).max(5000),
  request: z.string().trim().min(5).max(2000),
  constraints: z.string().trim().max(1000).optional().or(z.literal("")),
});

function SqlGeneratorPage() {
  return (
    <TaskRunner
      task="sql-generator"
      title="SQL Generator"
      description="Turn natural language into correct, performant SQL for your dialect."
      fields={fields}
      schema={schema}
      exportExt="sql"
    />
  );
}
