import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Sparkles,
  BarChart3,
  Brain,
  Network,
  Bot,
  FileText,
  Code2,
  Globe,
  Workflow,
  AppWindow,
  Cpu,
  Wrench,
  ArrowRight,
  Check,
  Github,
  Zap,
  Shield,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { MODULES } from "@/config/modules";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/app" });
  },
  component: Landing,
});

const CAPABILITIES = [
  { icon: Wrench, title: "Core Tools", desc: "Foundational utilities for every workflow." },
  { icon: BarChart3, title: "Data Science", desc: "Explore, transform & visualize datasets." },
  { icon: Brain, title: "Machine Learning", desc: "Train, evaluate & deploy classical ML." },
  { icon: Network, title: "Deep Learning", desc: "Neural networks at production scale." },
  { icon: Sparkles, title: "Generative AI", desc: "Text, image, audio & video generation." },
  { icon: Bot, title: "Agentic AI", desc: "Autonomous multi-agent workflows." },
  { icon: FileText, title: "Document AI", desc: "Parse, extract & reason over docs." },
  { icon: Code2, title: "Developer Tools", desc: "Code intelligence & productivity." },
  { icon: Globe, title: "Web Scraping", desc: "Structured extraction at scale." },
  { icon: Workflow, title: "Automation", desc: "No-code triggers & pipelines." },
  { icon: AppWindow, title: "App Development", desc: "Ship full-stack apps faster." },
  { icon: Cpu, title: "MLOps", desc: "Registries, pipelines & monitoring." },
];

const PERKS = [
  "Free starter workspace",
  "12 integrated AI modules",
  "Enterprise-grade security",
  "No credit card required",
];

function Landing() {
  return (
    <div className="dark min-h-screen aurora-bg text-foreground antialiased">
      {/* Nav */}
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-violet-500 shadow-lg shadow-violet-500/30">
            <Sparkles className="h-5 w-5 text-black" />
          </div>
          <span className="text-lg font-semibold tracking-tight">AI Studio</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
          <a href="#capabilities" className="transition hover:text-white">Capabilities</a>
          <a href="#features" className="transition hover:text-white">Features</a>
          <a href="#cta" className="transition hover:text-white">Get started</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="text-white/80 hover:bg-white/10 hover:text-white">
            <Link to="/login">Sign in</Link>
          </Button>
          <Button
            asChild
            className="bg-white text-black hover:bg-white/90"
          >
            <Link to="/signup">
              Get started <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-6 pt-16 pb-24 md:pt-24 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            New · Agentic AI workflows are live
          </div>
          <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            One studio for{" "}
            <span className="text-aurora">every AI workflow</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70 md:text-xl">
            Data Science, Machine Learning, Generative AI, Agentic systems, Document
            intelligence and MLOps — unified into a single enterprise platform.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 bg-white px-6 text-base font-semibold text-black shadow-xl shadow-emerald-500/10 hover:bg-white/90"
            >
              <Link to="/signup">
                Create free account <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-white/20 bg-white/5 px-6 text-base text-white backdrop-blur hover:bg-white/10 hover:text-white"
            >
              <Link to="/login">Sign in to workspace</Link>
            </Button>
          </div>

          <ul className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/60">
            {PERKS.map((p) => (
              <li key={p} className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-400" />
                {p}
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* Capabilities */}
      <section
        id="capabilities"
        className="relative border-t border-white/5 bg-black/20 py-24 backdrop-blur-sm"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-400">
              Capabilities
            </p>
            <h2 className="mt-3 text-3xl font-semibold md:text-5xl">
              Twelve modules. One workspace.
            </h2>
            <p className="mt-4 text-white/60">
              Everything your teams need to build, ship, and operate AI — out of the box.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {CAPABILITIES.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="group glass-card relative overflow-hidden rounded-2xl p-5 transition hover:border-white/20"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/20 to-violet-500/20 ring-1 ring-white/10">
                  <c.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-base font-semibold text-white">{c.title}</h3>
                <p className="mt-1 text-sm text-white/60">{c.desc}</p>
                <div className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 transition group-hover:opacity-100" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-3">
          {[
            {
              icon: Zap,
              title: "Lightning fast",
              desc: "Built on a modern edge runtime with streaming responses and instant cold starts.",
            },
            {
              icon: Shield,
              title: "Enterprise security",
              desc: "Row-level security, JWT auth, role-based access and a full audit trail.",
            },
            {
              icon: Layers,
              title: "Composable",
              desc: "Mix and match modules — from data prep to agent orchestration in MLOps pipelines.",
            },
          ].map((f) => (
            <div key={f.title} className="glass-card rounded-2xl p-6">
              <f.icon className="h-6 w-6 text-emerald-400" />
              <h3 className="mt-4 text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-white/60">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="relative px-6 pb-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600/20 via-black/40 to-emerald-500/20 p-10 text-center md:p-16">
          <div className="absolute inset-0 -z-10 opacity-60 [background:radial-gradient(ellipse_at_top,white_0%,transparent_50%)]/10" />
          <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Ready to build the future with AI?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Spin up your workspace in seconds. Sign in to continue, or create a free
            account to explore all {MODULES.length} modules.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 bg-white px-8 text-base font-semibold text-black hover:bg-white/90"
            >
              <Link to="/signup">
                Create free account <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-white/20 bg-white/5 px-8 text-base text-white hover:bg-white/10 hover:text-white"
            >
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} AI Studio. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="transition hover:text-white">Privacy</a>
            <a href="#" className="transition hover:text-white">Terms</a>
            <a href="#" className="inline-flex items-center gap-1.5 transition hover:text-white">
              <Github className="h-4 w-4" /> GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
