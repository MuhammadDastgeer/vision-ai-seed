import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Brush, BarChart3, LineChart, Database, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_protected/app/data-science")({
  component: DataScienceLayout,
});

const TABS = [
  { to: "/app/data-science", label: "Overview", icon: Sparkles, exact: true },
  { to: "/app/data-science/data-cleaning", label: "Data Cleaning", icon: Brush },
  { to: "/app/data-science/eda", label: "EDA Analyzer", icon: BarChart3 },
  { to: "/app/data-science/visualization", label: "Visualization", icon: LineChart },
  { to: "/app/data-science/sql-generator", label: "SQL Generator", icon: Database },
] as const;

function DataScienceLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Science"
        description="Clean datasets, explore, visualize, and write SQL — powered by AI."
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
