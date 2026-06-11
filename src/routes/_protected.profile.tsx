import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_protected/profile")({ component: ProfilePage });

interface ProfileForm {
  display_name: string;
  bio: string;
}

function ProfilePage() {
  const { profile, user, session, updateProfile } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileForm>({ defaultValues: { display_name: "", bio: "" } });

  useEffect(() => {
    if (profile) reset({ display_name: profile.display_name ?? "", bio: profile.bio ?? "" });
  }, [profile, reset]);

  const { data: roles } = useQuery({
    queryKey: ["user-roles", session?.user.id],
    enabled: !!session?.user.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session!.user.id);
      return (data ?? []).map((r) => r.role as string);
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    try {
      await updateProfile({
        display_name: data.display_name.trim() || null,
        bio: data.bio.trim() || null,
      });
      toast.success("Profile saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update profile");
    }
  };

  const initials = (user?.name ?? "U").slice(0, 2).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mx-auto max-w-2xl space-y-6"
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your personal information and roles.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <Avatar className="h-14 w-14">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle>{user?.name ?? "—"}</CardTitle>
            <CardDescription>{user?.email}</CardDescription>
            <div className="mt-2 flex flex-wrap gap-1">
              {(roles ?? []).map((r) => (
                <Badge key={r} variant="secondary" className="capitalize">{r}</Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-3 rounded-lg border bg-muted/30 p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">First signed up</p>
              <p className="mt-1 text-sm font-medium">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleString()
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Last sign-in</p>
              <p className="mt-1 text-sm font-medium">
                {session?.user.last_sign_in_at
                  ? new Date(session.user.last_sign_in_at).toLocaleString()
                  : "—"}
              </p>
            </div>
          </div>


          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="display_name">Display name</Label>
              <Input
                id="display_name"
                {...register("display_name", { maxLength: { value: 80, message: "Too long" } })}
              />
              {errors.display_name && <p className="text-xs text-destructive">{errors.display_name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                rows={4}
                placeholder="A short description about you…"
                {...register("bio", { maxLength: { value: 500, message: "Max 500 chars" } })}
              />
              {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting || !isDirty}>
                {isSubmitting ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
