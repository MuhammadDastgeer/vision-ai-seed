import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Brush, BarChart3, LineChart, Database, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/_protected/app/data-science/")({
  component: DataScienceIndex,
});

const PAGES = [
  {
    to: "/app/data-science/data-cleaning",
    title: "Data Cleaning",
    tagline: "Plan + Python code to clean any dataset.",
    icon: Brush,
  },
  {
    to: "/app/data-science/eda",
    title: "EDA Analyzer",
    tagline: "Exploratory analysis with insights and snippets.",
    icon: BarChart3,
  },
  {
    to: "/app/data-science/visualization",
    title: "Visualization Builder",
    tagline: "Recommended charts with matplotlib + plotly code.",
    icon: LineChart,
  },
  {
    to: "/app/data-science/sql-generator",
    title: "SQL Generator",
    tagline: "Natural language → optimized SQL for any dialect.",
    icon: Database,
  },
] as const;

function DataScienceIndex() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {PAGES.map((p, i) => {
        const Icon = p.icon;
        return (
          <motion.div
            key={p.to}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.04 }}
          >
            <Link to={p.to} className="block h-full">
              <Card className="group h-full transition-all hover:border-primary/40 hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    <span>{p.title}</span>
                    <ArrowRight className="h-4 w-4 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </CardTitle>
                  <CardDescription>{p.tagline}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Open the tool to generate output.
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
