import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Download, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { getCoreTool, type ToolDef } from "@/config/core-tools";
import { runCoreTool } from "@/lib/core-tools.functions";

export const Route = createFileRoute("/_protected/app/core-tools/$tool")({
  loader: ({ params }) => {
    const tool = getCoreTool(params.tool);
    if (!tool) throw notFound();
    return { tool };
  },
  component: ToolPage,
  notFoundComponent: () => (
    <div className="p-6 text-center text-muted-foreground">Tool not found.</div>
  ),
});

function ToolPage() {
  const { tool } = Route.useLoaderData();
  return <ToolView key={tool.slug} tool={tool} />;
}

function ToolView({ tool }: { tool: ToolDef }) {
  const Icon = tool.icon;
  const run = useServerFn(runCoreTool);
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const defaults = useMemo(() => {
    const o: Record<string, any> = {};
    for (const f of tool.fields) o[f.name] = f.type === "number" ? "" : "";
    return o;
  }, [tool]);

  const form = useForm<Record<string, any>>({
    resolver: zodResolver(tool.schema as any),
    defaultValues: defaults,
    mode: "onBlur",
  });

  const onSubmit = async (values: Record<string, any>) => {
    setLoading(true);
    setOutput("");
    try {
      const res = await run({ data: { tool: tool.slug, payload: values } });
      setOutput(res.output);
      toast.success("Generated.");
    } catch (err: any) {
      const msg = err?.message || "Generation failed.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard.");
  };

  const download = (kind: "raw" | "txt") => {
    if (!output) return;
    const ext = kind === "txt" ? "txt" : tool.exportExt;
    const mime =
      tool.exportExt === "json" && kind === "raw"
        ? "application/json"
        : tool.exportExt === "md" && kind === "raw"
        ? "text/markdown"
        : "text/plain";
    const blob = new Blob([output], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tool.slug}-${Date.now()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2 h-8">
          <Link to="/app/core-tools">
            <ArrowLeft className="h-4 w-4" />
            Back to Core Tools
          </Link>
        </Button>
        <PageHeader title={tool.title} description={tool.description} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Card>
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <CardTitle>Inputs</CardTitle>
              <CardDescription>Fill in the details and generate.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {tool.fields.map((f) => {
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
                          onValueChange={(v) => form.setValue(f.name, v, { shouldValidate: true })}
                          defaultValue={form.getValues(f.name) || undefined}
                        >
                          <SelectTrigger id={f.name}>
                            <SelectValue placeholder={f.placeholder || "Select…"} />
                          </SelectTrigger>
                          <SelectContent>
                            {f.options?.map((o) => (
                              <SelectItem key={o} value={o}>
                                {o}
                              </SelectItem>
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
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate
                    </>
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
                    {output
                      ? `Generated ${tool.outputFormat.toUpperCase()}.`
                      : "Your generated content will appear here."}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={copy} disabled={!output}>
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => download("raw")} disabled={!output}>
                    <Download className="h-4 w-4" />.{tool.exportExt}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => download("txt")} disabled={!output}>
                    <Download className="h-4 w-4" />.txt
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading && !output ? (
                <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Working…
                </div>
              ) : output ? (
                <ScrollArea className="h-[28rem] w-full rounded-md border bg-muted/30">
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
    </div>
  );
}
