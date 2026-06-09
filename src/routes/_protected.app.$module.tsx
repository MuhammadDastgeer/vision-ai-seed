import { createFileRoute, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MODULES } from "@/config/modules";

export const Route = createFileRoute("/_protected/app/$module")({
  loader: ({ params }) => {
    const mod = MODULES.find((m) => m.slug === params.module);
    if (!mod) throw notFound();
    return { module: mod };
  },
  component: ModulePage,
  notFoundComponent: () => (
    <div className="p-6 text-center text-muted-foreground">Module not found.</div>
  ),
});

function ModulePage() {
  const { module } = Route.useLoaderData();
  const Icon = module.icon;
  return (
    <div className="space-y-6">
      <PageHeader title={module.title} description={module.description} />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <CardTitle>{module.title}</CardTitle>
            <CardDescription>
              This module is ready for implementation. Drop your feature components and services here.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Slug: <code className="rounded bg-muted px-1 py-0.5">{module.slug}</code>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
