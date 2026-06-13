import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { Copy, Loader2, Save, Sparkles, Trash2, History as HistoryIcon } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  buildPrompts,
  type PromptBuilderOutput,
} from "@/lib/prompt-builder.functions";

export const Route = createFileRoute("/_protected/app/prompt-builder")({
  component: PromptBuilderPage,
});

const formSchema = z.object({
  goal: z.string().trim().min(3, "Goal is required").max(2000),
  role: z.string().trim().max(200).optional().or(z.literal("")),
  audience: z.string().trim().max(200).optional().or(z.literal("")),
  context: z.string().trim().max(3000).optional().or(z.literal("")),
  tone: z.string().trim().max(60).optional().or(z.literal("")),
  outputFormat: z.string().trim().max(60).optional().or(z.literal("")),
});
type FormValues = z.infer<typeof formSchema>;

const TONES = ["neutral", "friendly", "formal", "playful", "expert", "concise", "persuasive"];
const FORMATS = ["markdown", "json", "bullet list", "table", "plain text", "step-by-step"];

type HistoryItem = {
  id: string;
  createdAt: number;
  input: FormValues;
  output: PromptBuilderOutput;
  label: string;
};

const STORAGE_KEY = "prompt-builder-history-v1";

function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveHistory(items: HistoryItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 50)));
  } catch {
    /* ignore quota */
  }
}

function PromptBuilderPage() {
  const run = useServerFn(buildPrompts);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<PromptBuilderOutput | null>(null);
  const [tab, setTab] = useState<"optimized" | "system" | "expert">("optimized");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goal: "",
      role: "",
      audience: "",
      context: "",
      tone: "neutral",
      outputFormat: "markdown",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setOutput(null);
    try {
      const res = await run({ data: values });
      setOutput(res);
      toast.success("Prompts generated.");
    } catch (err: any) {
      toast.error(err?.message || "Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async (text: string, label: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied.`);
  };

  const saveCurrent = () => {
    if (!output) return;
    const values = form.getValues();
    const item: HistoryItem = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      input: values,
      output,
      label: values.goal.slice(0, 80) || "Untitled prompt",
    };
    const next = [item, ...history];
    setHistory(next);
    saveHistory(next);
    toast.success("Saved to history.");
  };

  const restore = (item: HistoryItem) => {
    form.reset(item.input);
    setOutput(item.output);
    setTab("optimized");
    toast.success("Restored from history.");
  };

  const remove = (id: string) => {
    const next = history.filter((h) => h.id !== id);
    setHistory(next);
    saveHistory(next);
  };

  const clearAll = () => {
    setHistory([]);
    saveHistory([]);
    toast.success("History cleared.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prompt Builder"
        description="Generate optimized, system, and expert prompts from a single intent."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Inputs</CardTitle>
              <CardDescription>Describe what you want the model to do.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Field label="Goal" required error={form.formState.errors.goal?.message}>
                  <Textarea
                    rows={3}
                    placeholder="e.g. Summarize legal contracts for non-lawyers in under 200 words."
                    {...form.register("goal")}
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Role" error={form.formState.errors.role?.message}>
                    <Input placeholder="Senior contract lawyer" {...form.register("role")} />
                  </Field>
                  <Field label="Audience" error={form.formState.errors.audience?.message}>
                    <Input placeholder="Small business owners" {...form.register("audience")} />
                  </Field>
                </div>

                <Field label="Context" error={form.formState.errors.context?.message}>
                  <Textarea
                    rows={3}
                    placeholder="Background, source material, or any relevant constraints."
                    {...form.register("context")}
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Tone">
                    <Select
                      defaultValue="neutral"
                      onValueChange={(v) => form.setValue("tone", v)}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {TONES.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Output format">
                    <Select
                      defaultValue="markdown"
                      onValueChange={(v) => form.setValue("outputFormat", v)}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {FORMATS.map((f) => (
                          <SelectItem key={f} value={f}>{f}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</>
                  ) : (
                    <><Sparkles className="h-4 w-4" /> Generate</>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle>Output</CardTitle>
                  <CardDescription>
                    {output ? "Three prompt variants tailored to your intent." : "Your prompts will appear here."}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={saveCurrent} disabled={!output}>
                    <Save className="h-4 w-4" /> Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => output && copy(output[tab], tabLabel(tab))}
                    disabled={!output}
                  >
                    <Copy className="h-4 w-4" /> Copy
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading && !output ? (
                <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Working…
                </div>
              ) : output ? (
                <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="optimized">Optimized</TabsTrigger>
                    <TabsTrigger value="system">System</TabsTrigger>
                    <TabsTrigger value="expert">Expert</TabsTrigger>
                  </TabsList>
                  {(["optimized", "system", "expert"] as const).map((k) => (
                    <TabsContent key={k} value={k} className="mt-3">
                      <ScrollArea className="h-[26rem] w-full rounded-md border bg-muted/30">
                        <pre className="whitespace-pre-wrap break-words p-4 text-xs leading-relaxed">
                          {output[k]}
                        </pre>
                      </ScrollArea>
                      <div className="mt-2 flex justify-end">
                        <Button variant="ghost" size="sm" onClick={() => copy(output[k], tabLabel(k))}>
                          <Copy className="h-4 w-4" /> Copy {tabLabel(k)}
                        </Button>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <div className="flex h-72 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                  No output yet.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HistoryIcon className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-base">History</CardTitle>
                  <Badge variant="secondary">{history.length}</Badge>
                </div>
                {history.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAll}>
                    Clear all
                  </Button>
                )}
              </div>
              <CardDescription>Saved prompts are stored locally on this device.</CardDescription>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="flex h-24 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                  No saved prompts yet.
                </div>
              ) : (
                <ScrollArea className="h-56">
                  <ul className="space-y-2 pr-3">
                    {history.map((h) => (
                      <li
                        key={h.id}
                        className="flex items-center justify-between gap-2 rounded-md border bg-card p-2.5"
                      >
                        <button
                          onClick={() => restore(h)}
                          className="min-w-0 flex-1 text-left"
                        >
                          <div className="truncate text-sm font-medium">{h.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(h.createdAt).toLocaleString()}
                          </div>
                        </button>
                        <Button variant="ghost" size="icon" onClick={() => remove(h.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function tabLabel(k: "optimized" | "system" | "expert") {
  return k === "optimized" ? "Optimized Prompt" : k === "system" ? "System Prompt" : "Expert Prompt";
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
