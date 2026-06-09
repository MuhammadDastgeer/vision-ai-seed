import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { getAuthToken } from "@/lib/api/client";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && getAuthToken()) {
      throw redirect({ to: "/app" });
    }
  },
  component: Landing,
});

function Landing() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
        <Sparkles className="h-7 w-7" />
      </div>
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">AI Studio</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        An enterprise foundation for Data Science, ML, Deep Learning, Generative AI,
        Agentic AI, Document AI, MLOps and beyond.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild size="lg">
          <Link to="/login">Sign in</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/app">Enter Studio</Link>
        </Button>
      </div>
    </div>
  );
}
