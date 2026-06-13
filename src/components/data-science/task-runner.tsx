import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerFn } from "@tanstack/react-start";
import type { ZodTypeAny } from "zod";
import { motion } from "framer-motion";
import { Copy, Download, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
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
import { runDataScienceTask } from "@/lib/data-science.functions";

export type DSFieldType = "text" | "textarea" | "number" | "select";

export interface DSField {
  name: string;
  label: string;
  type: DSFieldType;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  rows?: number;
  defaultValue?: string;
}

interface Props {
  task: "data-cleaning" | "eda" | "visualization" | "sql-generator";
  title: string;
  description: string;
  fields: DSField[];
  schema: ZodTypeAny;
  exportExt?: "md" | "py" | "sql";
}

export function TaskRunner({
  task,
  title,
  description,
  fields,
  schema,
  exportExt = "md",
}: Props) {
  const run = useServerFn(runDataScienceTask);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const defaults = fields.reduce<Record<string, any>>((acc, f) => {
    acc[f.name] = f.defaultValue ?? "";
    return acc;
  }, {});

  const form = useForm<Record<string, any>>({
    resolver: zodResolver(schema as any),
    defaultValues: defaults,
    mode: "onBlur",
  });

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

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard.");
  };

  const download = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${task}-${Date.now()}.${exportExt}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

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
      >
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle>Output</CardTitle>
                <CardDescription>
                  {output ? "Generated content." : "Your output will appear here."}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copy} disabled={!output}>
                  <Copy className="h-4 w-4" /> Copy
                </Button>
                <Button variant="outline" size="sm" onClick={download} disabled={!output}>
                  <Download className="h-4 w-4" /> .{exportExt}
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
              <ScrollArea className="h-[30rem] w-full rounded-md border bg-muted/30">
                <pre className="whitespace-pre-wrap break-words p-4 text-xs leading-relaxed">
                  {output}
                </pre>
              </ScrollArea>
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
