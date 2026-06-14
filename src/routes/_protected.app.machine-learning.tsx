import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Boxes, Wand2, ClipboardCheck, Layers, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_protected/app/machine-learning")({
  component: MachineLearningLayout,
});

const TABS = [
  { to: "/app/machine-learning", label: "Overview", icon: Sparkles, exact: true },
  { to: "/app/machine-learning/ml-builder", label: "ML Builder", icon: Boxes },
  { to: "/app/machine-learning/automl", label: "AutoML", icon: Wand2 },
  { to: "/app/machine-learning/model-evaluator", label: "Model Evaluator", icon: ClipboardCheck },
  { to: "/app/machine-learning/feature-engineering", label: "Feature Engineering", icon: Layers },
] as const;

function MachineLearningLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Machine Learning"
        description="Build, tune, evaluate, and engineer features for ML models — powered by AI."
      />
      <nav className="flex flex-wrap gap-2 border-b pb-3">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = isActive(t.to, "exact" in t ? t.exact : false);
          return (
            <Link
              key={t.to}
              to={t.to}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </Link>
          );
        })}
      </nav>
      <Outlet />
    </div>
  );
}
