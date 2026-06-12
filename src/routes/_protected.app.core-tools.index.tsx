import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CORE_TOOLS } from "@/config/core-tools";

export const Route = createFileRoute("/_protected/app/core-tools/")({
  component: CoreToolsIndex,
});

function CoreToolsIndex() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Core Tools"
        description="Foundational AI utilities that power everyday workflows."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        {CORE_TOOLS.map((tool, i) => {
          const Icon = tool.icon;
          return (
            <motion.div
              key={tool.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link
                to="/app/core-tools/$tool"
                params={{ tool: tool.slug }}
                className="block h-full"
              >
                <Card className="group h-full transition-all hover:border-primary/40 hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="flex items-center justify-between">
                      <span>{tool.title}</span>
                      <ArrowRight className="h-4 w-4 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </CardTitle>
                    <CardDescription>{tool.tagline}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {tool.description}
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
