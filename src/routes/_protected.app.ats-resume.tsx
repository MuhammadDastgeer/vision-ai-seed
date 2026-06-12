import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import {
  Download,
  FileText,
  Loader2,
  Mail,
  Sparkles,
  Target,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import jsPDF from "jspdf";
import {
  Document as DocxDocument,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  generateAtsResume,
  type AtsResumeOutput,
} from "@/lib/ats-resume.functions";

export const Route = createFileRoute("/_protected/app/ats-resume")({
  component: AtsResumePage,
});

const Schema = z.object({
  fullName: z.string().trim().min(2, "Required").max(120),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  location: z.string().trim().max(120).optional().or(z.literal("")),
  targetRole: z.string().trim().min(2, "Required").max(160),
  skills: z.string().trim().min(2, "Required").max(2000),
  experience: z.string().trim().min(5, "Required").max(6000),
  education: z.string().trim().min(2, "Required").max(3000),
  projects: z.string().trim().max(4000).optional().or(z.literal("")),
  jobDescription: z.string().trim().max(6000).optional().or(z.literal("")),
});
type FormValues = z.infer<typeof Schema>;

function AtsResumePage() {
  const run = useServerFn(generateAtsResume);
  const [data, setData] = useState<AtsResumeOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      targetRole: "",
      skills: "",
      experience: "",
      education: "",
      projects: "",
      jobDescription: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setData(null);
    try {
      const res = await run({ data: values });
      setData(res);
      toast.success("Resume generated.");
    } catch (e: any) {
      toast.error(e?.message || "Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const values = form.getValues();

  const downloadPdf = () => {
    if (!data) return;
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const margin = 48;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - margin * 2;
    let y = margin;

    const write = (text: string, size: number, bold = false, gap = 4) => {
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(text, maxWidth);
      for (const ln of lines) {
        if (y > 760) {
          doc.addPage();
          y = margin;
        }
        doc.text(ln, margin, y);
        y += size + gap;
      }
    };
    const rule = () => {
      y += 4;
      doc.setDrawColor(200);
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;
    };

    write(values.fullName, 20, true, 2);
    const contact = [values.email, values.phone, values.location].filter(Boolean).join(" · ");
    write(contact, 10, false, 2);
    rule();

    write("Summary", 12, true);
    write(data.resume.summary, 10, false, 3);
    rule();

    write("Skills", 12, true);
    write(data.resume.skills.join(" · "), 10, false, 3);
    rule();

    write("Experience", 12, true);
    for (const exp of data.resume.experience) {
      write(`${exp.role} — ${exp.company}`, 11, true, 2);
      write(exp.period, 9, false, 3);
      for (const b of exp.bullets) write(`• ${b}`, 10, false, 2);
      y += 4;
    }
    rule();

    write("Education", 12, true);
    for (const ed of data.resume.education) {
      write(`${ed.degree} — ${ed.school}`, 11, true, 2);
      write(ed.period, 9, false, 3);
      if (ed.details) write(ed.details, 10, false, 3);
    }

    if (data.resume.projects.length) {
      rule();
      write("Projects", 12, true);
      for (const p of data.resume.projects) {
        write(p.name + (p.tech ? ` (${p.tech})` : ""), 11, true, 2);
        write(p.description, 10, false, 4);
      }
    }

    doc.save(`${values.fullName.replace(/\s+/g, "_")}_Resume.pdf`);
  };

  const downloadDocx = async () => {
    if (!data) return;
    const para = (text: string, opts: { bold?: boolean; size?: number; spacing?: number } = {}) =>
      new Paragraph({
        spacing: { after: opts.spacing ?? 80 },
        children: [new TextRun({ text, bold: opts.bold, size: opts.size ?? 22 })],
      });

    const children: Paragraph[] = [
      new Paragraph({
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.LEFT,
        children: [new TextRun({ text: values.fullName, bold: true, size: 40 })],
      }),
      para(
        [values.email, values.phone, values.location].filter(Boolean).join(" · "),
        { size: 20, spacing: 200 },
      ),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "Summary", bold: true })] }),
      para(data.resume.summary),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "Skills", bold: true })] }),
      para(data.resume.skills.join(" · ")),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "Experience", bold: true })] }),
    ];

    for (const exp of data.resume.experience) {
      children.push(para(`${exp.role} — ${exp.company}`, { bold: true }));
      children.push(para(exp.period, { size: 18 }));
      for (const b of exp.bullets) children.push(para(`• ${b}`));
    }
    children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "Education", bold: true })] }));
    for (const ed of data.resume.education) {
      children.push(para(`${ed.degree} — ${ed.school}`, { bold: true }));
      children.push(para(ed.period, { size: 18 }));
      if (ed.details) children.push(para(ed.details));
    }
    if (data.resume.projects.length) {
      children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "Projects", bold: true })] }));
      for (const p of data.resume.projects) {
        children.push(para(p.name + (p.tech ? ` (${p.tech})` : ""), { bold: true }));
        children.push(para(p.description));
      }
    }

    const doc = new DocxDocument({ sections: [{ children }] });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${values.fullName.replace(/\s+/g, "_")}_Resume.docx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const Field = ({
    name,
    label,
    placeholder,
    type = "text",
    required,
  }: {
    name: keyof FormValues;
    label: string;
    placeholder?: string;
    type?: "text" | "email";
    required?: boolean;
  }) => {
    const err = form.formState.errors[name]?.message as string | undefined;
    return (
      <div className="space-y-1.5">
        <Label htmlFor={name}>
          {label}
          {required && <span className="text-destructive"> *</span>}
        </Label>
        <Input id={name} type={type} placeholder={placeholder} {...form.register(name)} />
        {err && <p className="text-xs text-destructive">{err}</p>}
      </div>
    );
  };

  const Area = ({
    name,
    label,
    placeholder,
    rows = 4,
    required,
  }: {
    name: keyof FormValues;
    label: string;
    placeholder?: string;
    rows?: number;
    required?: boolean;
  }) => {
    const err = form.formState.errors[name]?.message as string | undefined;
    return (
      <div className="space-y-1.5">
        <Label htmlFor={name}>
          {label}
          {required && <span className="text-destructive"> *</span>}
        </Label>
        <Textarea id={name} rows={rows} placeholder={placeholder} {...form.register(name)} />
        {err && <p className="text-xs text-destructive">{err}</p>}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="ATS Resume Generator"
        description="AI-tailored resume, ATS score, and matching cover letter."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Your details</CardTitle>
              <CardDescription>The more specific, the better the match.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field name="fullName" label="Full name" placeholder="Ada Lovelace" required />
                  <Field name="email" label="Email" type="email" placeholder="ada@example.com" required />
                  <Field name="phone" label="Phone" placeholder="+1 555 123 4567" />
                  <Field name="location" label="Location" placeholder="Berlin, DE" />
                </div>
                <Field name="targetRole" label="Target role" placeholder="Senior ML Engineer" required />
                <Area
                  name="skills"
                  label="Skills"
                  placeholder="Python, PyTorch, SQL, AWS…"
                  rows={2}
                  required
                />
                <Area
                  name="experience"
                  label="Experience"
                  placeholder={"Company — Role — 2021–Present\n- Built X that did Y"}
                  rows={6}
                  required
                />
                <Area
                  name="education"
                  label="Education"
                  placeholder="B.Sc. Computer Science, MIT, 2019"
                  rows={3}
                  required
                />
                <Area
                  name="projects"
                  label="Projects"
                  placeholder="Project — what it does — tech"
                  rows={3}
                />
                <Area
                  name="jobDescription"
                  label="Job description (optional)"
                  placeholder="Paste the JD to tailor the resume…"
                  rows={4}
                />

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button type="submit" disabled={loading}>
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
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPreviewOpen(true)}
                    disabled={!data}
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                  <Button type="button" variant="outline" onClick={downloadPdf} disabled={!data}>
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                  <Button type="button" variant="outline" onClick={downloadDocx} disabled={!data}>
                    <Download className="h-4 w-4" />
                    DOCX
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="lg:col-span-3"
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Output</CardTitle>
              <CardDescription>
                {data
                  ? "Resume, ATS analysis, and cover letter."
                  : "Generate to see your tailored resume here."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading && !data ? (
                <div className="flex h-80 items-center justify-center text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Crafting your resume…
                </div>
              ) : !data ? (
                <div className="flex h-80 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                  Nothing here yet.
                </div>
              ) : (
                <Tabs defaultValue="resume">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="resume">
                      <FileText className="mr-1.5 h-4 w-4" /> Resume
                    </TabsTrigger>
                    <TabsTrigger value="ats">
                      <Target className="mr-1.5 h-4 w-4" /> ATS Score
                    </TabsTrigger>
                    <TabsTrigger value="cover">
                      <Mail className="mr-1.5 h-4 w-4" /> Cover Letter
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="resume" className="mt-4">
                    <ScrollArea className="h-[34rem] rounded-md border p-4">
                      <ResumeView values={values} data={data} />
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="ats" className="mt-4 space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">ATS Match Score</span>
                        <span className="text-2xl font-semibold">{data.atsScore.score}/100</span>
                      </div>
                      <Progress value={data.atsScore.score} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Strengths</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc space-y-1 pl-5 text-sm">
                            {data.atsScore.strengths.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Improvements</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc space-y-1 pl-5 text-sm">
                            {data.atsScore.improvements.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-medium">Keywords</p>
                      <div className="flex flex-wrap gap-1.5">
                        {data.atsScore.keywords.map((k) => (
                          <Badge key={k} variant="secondary">
                            {k}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="cover" className="mt-4">
                    <ScrollArea className="h-[34rem] rounded-md border bg-muted/30 p-4">
                      <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed">
                        {data.coverLetter}
                      </pre>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Resume preview</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[70vh] rounded-md border bg-background p-6">
            {data && <ResumeView values={values} data={data} />}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ResumeView({ values, data }: { values: FormValues; data: AtsResumeOutput }) {
  return (
    <div className="space-y-4 text-sm">
      <div className="border-b pb-3">
        <h2 className="text-2xl font-semibold">{values.fullName}</h2>
        <p className="text-xs text-muted-foreground">
          {[values.email, values.phone, values.location].filter(Boolean).join(" · ")}
        </p>
      </div>
      <Section title="Summary">
        <p>{data.resume.summary}</p>
      </Section>
      <Section title="Skills">
        <div className="flex flex-wrap gap-1.5">
          {data.resume.skills.map((s) => (
            <Badge key={s} variant="outline">
              {s}
            </Badge>
          ))}
        </div>
      </Section>
      <Section title="Experience">
        <div className="space-y-3">
          {data.resume.experience.map((e, i) => (
            <div key={i}>
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-medium">
                  {e.role} — {e.company}
                </p>
                <span className="text-xs text-muted-foreground">{e.period}</span>
              </div>
              <ul className="list-disc pl-5">
                {e.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Education">
        <div className="space-y-2">
          {data.resume.education.map((ed, i) => (
            <div key={i}>
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-medium">
                  {ed.degree} — {ed.school}
                </p>
                <span className="text-xs text-muted-foreground">{ed.period}</span>
              </div>
              {ed.details && <p className="text-muted-foreground">{ed.details}</p>}
            </div>
          ))}
        </div>
      </Section>
      {data.resume.projects.length > 0 && (
        <Section title="Projects">
          <div className="space-y-2">
            {data.resume.projects.map((p, i) => (
              <div key={i}>
                <p className="font-medium">
                  {p.name}
                  {p.tech && <span className="ml-1 text-xs text-muted-foreground">({p.tech})</span>}
                </p>
                <p>{p.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  );
}
