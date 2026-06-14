import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerFn } from "@tanstack/react-start";
import type { ZodTypeAny } from "zod";
import { motion } from "framer-motion";
import { Copy, Download, Loader2, Sparkles, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { runMLTask } from "@/lib/machine-learning.functions";

export type MLFieldType = "text" | "textarea" | "number" | "select";

export interface MLField {
  name: string;
  label: string;
  type: MLFieldType;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  rows?: number;
  defaultValue?: string;
}

interface Props {
  task: "ml-builder" | "automl" | "model-evaluator" | "feature-engineering";
  title: string;
  description: string;
  datasetFieldName: string; // which field receives uploaded dataset preview
  fields: MLField[];
  schema: ZodTypeAny;
}

function extractMetrics(output: string): { name: string; value: number }[] | null {
  const fence = output.match(/```metrics-json\s*([\s\S]*?)```/i);
  if (!fence) return null;
  try {
    const parsed = JSON.parse(fence[1].trim());
    const arr = parsed?.metrics;
    if (!Array.isArray(arr)) return null;
    return arr
      .filter((m) => typeof m?.name === "string" && typeof m?.value === "number")
      .slice(0, 12);
  } catch {
    return null;
  }
}

export function MLTaskRunner({
  task,
  title,
  description,
  datasetFieldName,
  fields,
  schema,
}: Props) {
  const run = useServerFn(runMLTask);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [filename, setFilename] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const defaults = fields.reduce<Record<string, any>>((acc, f) => {
    acc[f.name] = f.defaultValue ?? "";
    return acc;
  }, {});

  const form = useForm<Record<string, any>>({
    resolver: zodResolver(schema as any),
    defaultValues: defaults,
    mode: "onBlur",
  });

  const metrics = useMemo(() => extractMetrics(output), [output]);

  const onSubmit = async (values: Record<string, any>) => {
    setLoading(true);
    setOutput("");
    try {
      const res = await run({ data: { task, payload: values } });
      setOutput(res.output);
      toast.success("Generated.");
    } catch (err: any) {
      toast.error(err?.message || "Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const onFile = async (file: File) => {
    if (!file) return;
    if (file.size > 2_000_000) {
      toast.error("File too large — please upload under 2 MB (a sample is enough).");
      return;
    }
    const text = await file.text();
    const lines = text.split(/\r?\n/).slice(0, 30).join("\n");
    const preview = `Filename: ${file.name}\nFirst rows:\n${lines}`;
    form.setValue(datasetFieldName, preview, { shouldValidate: true });
    setFilename(file.name);
    toast.success(`Loaded sample of ${file.name}.`);
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard.");
  };

  const download = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${task}-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const cleanedOutput = output.replace(/```metrics-json[\s\S]*?```/gi, "").trim();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Dataset upload (CSV / TSV / JSON sample)</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" /> Choose file
                  </Button>
                  <span className="truncate text-xs text-muted-foreground">
                    {filename ?? "No file — paste a description below instead."}
                  </span>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv,.tsv,.json,.txt"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void onFile(f);
                  }}
                />
              </div>

              {fields.map((f) => {
                const err = form.formState.errors[f.name]?.message as string | undefined;
                return (
                  <div key={f.name} className="space-y-1.5">
                    <Label htmlFor={f.name}>
                      {f.label}
                      {f.required && <span className="text-destructive"> *</span>}
                    </Label>
                    {f.type === "textarea" ? (
                      <Textarea
                        id={f.name}
                        rows={f.rows ?? 4}
                        placeholder={f.placeholder}
                        {...form.register(f.name)}
                      />
                    ) : f.type === "select" ? (
                      <Select
                        defaultValue={f.defaultValue || undefined}
                        onValueChange={(v) =>
                          form.setValue(f.name, v, { shouldValidate: true })
                        }
                      >
                        <SelectTrigger id={f.name}>
                          <SelectValue placeholder={f.placeholder || "Select…"} />
                        </SelectTrigger>
                        <SelectContent>
                          {f.options?.map((o) => (
                            <SelectItem key={o} value={o}>{o}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id={f.name}
                        type={f.type === "number" ? "number" : "text"}
                        placeholder={f.placeholder}
                        {...form.register(f.name)}
                      />
                    )}
                    {err && <p className="text-xs font-medium text-destructive">{err}</p>}
                  </div>
                );
              })}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Training…</>
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
      >
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle>Results</CardTitle>
                <CardDescription>
                  {output ? "Report and metrics chart." : "Run a task to see output and charts."}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copy} disabled={!output}>
                  <Copy className="h-4 w-4" /> Copy
                </Button>
                <Button variant="outline" size="sm" onClick={download} disabled={!output}>
                  <Download className="h-4 w-4" /> .md
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
              <Tabs defaultValue="report" className="w-full">
                <TabsList>
                  <TabsTrigger value="report">Report</TabsTrigger>
                  <TabsTrigger value="chart" disabled={!metrics}>Chart</TabsTrigger>
                </TabsList>
                <TabsContent value="report">
                  <ScrollArea className="h-[28rem] w-full rounded-md border bg-muted/30">
                    <pre className="whitespace-pre-wrap break-words p-4 text-xs leading-relaxed">
                      {cleanedOutput}
                    </pre>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="chart">
                  {metrics && metrics.length > 0 ? (
                    <div className="h-[28rem] w-full rounded-md border bg-muted/20 p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={metrics} margin={{ top: 16, right: 16, left: 0, bottom: 32 }}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="name" angle={-20} textAnchor="end" interval={0} height={60} fontSize={11} />
                          <YAxis fontSize={11} />
                          <Tooltip />
                          <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">
                      No metrics chart in this output.
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex h-72 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                No output yet.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
