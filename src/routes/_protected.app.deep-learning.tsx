import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Sparkles, Image as ImageIcon, Waves, Network, Eye } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_protected/app/deep-learning")({
  component: DeepLearningLayout,
});

const TABS = [
  { to: "/app/deep-learning", label: "Overview", icon: Sparkles, exact: true },
  { to: "/app/deep-learning/cnn-builder", label: "CNN Builder", icon: ImageIcon },
  { to: "/app/deep-learning/lstm-builder", label: "LSTM Builder", icon: Waves },
  { to: "/app/deep-learning/transformer-builder", label: "Transformer", icon: Network },
  { to: "/app/deep-learning/computer-vision", label: "Computer Vision", icon: Eye },
] as const;

function DeepLearningLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Deep Learning"
        description="Design CNNs, LSTMs, Transformers, and Computer Vision pipelines with AI."
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
