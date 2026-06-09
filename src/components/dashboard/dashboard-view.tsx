import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  Users,
  FolderKanban,
  Clock,
  Bookmark,
  ArrowUpRight,
  Plus,
  MoreHorizontal,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  workspaces,
  recentProjects,
  savedProjects,
  history,
  type Project,
} from "@/config/dashboard-data";

const statusVariant: Record<Project["status"], "default" | "secondary" | "outline"> = {
  active: "default",
  draft: "secondary",
  archived: "outline",
};

const stats = [
  { label: "Workspaces", value: workspaces.length, delta: "+2 this month", icon: FolderKanban },
  { label: "Active projects", value: 23, delta: "+5 this week", icon: TrendingUp },
  { label: "Team members", value: 40, delta: "+3 this week", icon: Users },
  { label: "Saved", value: savedProjects.length, delta: "Updated today", icon: Bookmark },
];

export function DashboardView() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Your workspaces, projects, and recent activity."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Plus className="mr-1.5 h-4 w-4" /> Invite
            </Button>
            <Button size="sm">
              <Plus className="mr-1.5 h-4 w-4" /> New project
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.04 }}
          >
            <Card className="cursor-pointer transition-colors hover:border-primary/40">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {s.label}
                  </p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums">{s.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.delta}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Workspaces */}
      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold">Workspaces</h2>
            <p className="text-sm text-muted-foreground">Jump back into one of your spaces.</p>
          </div>
          <Button variant="ghost" size="sm">
            View all <ArrowUpRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((w, i) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
            >
              <Link to="/app" className="group block">
                <Card className="relative h-full overflow-hidden transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${w.color} opacity-60`}
                  />
                  <CardHeader className="relative">
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/80 text-foreground backdrop-blur">
                        <w.icon className="h-5 w-5" />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={(e) => e.preventDefault()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="mt-3 text-base">{w.name}</CardTitle>
                    <CardDescription>{w.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="relative flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <FolderKanban className="h-3.5 w-3.5" /> {w.projects} projects
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" /> {w.members}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent + History + Saved */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent projects (spans 2) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Recent projects</CardTitle>
              <CardDescription>Picked up where you left off.</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              View all <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y">
              {recentProjects.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/app"
                    className="grid grid-cols-12 items-center gap-3 px-6 py-3 transition-colors hover:bg-accent/40"
                  >
                    <div className="col-span-12 sm:col-span-5">
                      <p className="truncate text-sm font-medium">{p.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{p.workspace}</p>
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <div className="flex items-center gap-2">
                        <Progress value={p.progress} className="h-1.5" />
                        <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">
                          {p.progress}%
                        </span>
                      </div>
                    </div>
                    <div className="col-span-3 sm:col-span-2">
                      <Badge variant={statusVariant[p.status]} className="capitalize">
                        {p.status}
                      </Badge>
                    </div>
                    <div className="col-span-3 sm:col-span-2 text-right text-xs text-muted-foreground">
                      {p.updatedAt}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* History */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Activity history</CardTitle>
            </div>
            <Button variant="ghost" size="sm">All</Button>
          </CardHeader>
          <CardContent>
            <ol className="relative space-y-4 border-l pl-4">
              {history.map((h) => (
                <li key={h.id} className="cursor-pointer">
                  <span className="absolute -left-[5px] mt-1 h-2 w-2 rounded-full bg-primary" />
                  <p className="text-sm leading-snug">
                    <span className="text-muted-foreground">{h.action}</span>{" "}
                    <span className="font-medium">{h.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{h.at}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* Saved */}
      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Saved projects</h2>
          </div>
          <Button variant="ghost" size="sm">
            Manage <ArrowUpRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {savedProjects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
            >
              <Link to="/app" className="block">
                <Card className="h-full transition-colors hover:border-primary/40">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant={statusVariant[p.status]} className="capitalize">
                        {p.status}
                      </Badge>
                      <Bookmark className="h-4 w-4 fill-primary text-primary" />
                    </div>
                    <CardTitle className="mt-2 text-base">{p.name}</CardTitle>
                    <CardDescription>{p.workspace}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Progress value={p.progress} className="h-1.5" />
                      <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">
                        {p.progress}%
                      </span>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {["AB", "CD", "EF"].map((i) => (
                          <Avatar key={i} className="h-6 w-6 border-2 border-background">
                            <AvatarFallback className="text-[10px]">{i}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{p.updatedAt}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
