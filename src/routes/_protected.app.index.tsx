import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/page-header";
import { ModuleCard } from "@/components/common/module-card";
import { MODULES } from "@/config/modules";

export const Route = createFileRoute("/_protected/app/")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Choose a module to start working with AI Studio."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MODULES.map((m, i) => (
          <ModuleCard key={m.slug} module={m} index={i} />
        ))}
      </div>
    </div>
  );
}
