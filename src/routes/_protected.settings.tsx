import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";

export const Route = createFileRoute("/_protected/settings")({ component: SettingsPage });

interface PasswordForm {
  current: string;
  next: string;
  confirm: string;
}

function SettingsPage() {
  const { user, updatePassword, login } = useAuth();
  const [show, setShow] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PasswordForm>({ defaultValues: { current: "", next: "", confirm: "" } });

  const nextValue = watch("next");

  const onSubmit = async (data: PasswordForm) => {
    if (data.next !== data.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    if (!user?.email) {
      toast.error("No account email found");
      return;
    }
    try {
      // Re-authenticate with current password before allowing change
      await login(user.email, data.current);
      await updatePassword(data.next);
      toast.success("Password updated");
      reset({ current: "", next: "", confirm: "" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update password");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mx-auto max-w-2xl space-y-6"
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account security.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <KeyRound className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>Change password</CardTitle>
              <CardDescription>
                Enter your current password, then choose a new one (minimum 8 characters).
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current">Current password</Label>
              <Input
                id="current"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                {...register("current", { required: "Required" })}
              />
              {errors.current && (
                <p className="text-xs text-destructive">{errors.current.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="next">New password</Label>
              <Input
                id="next"
                type={show ? "text" : "password"}
                autoComplete="new-password"
                {...register("next", {
                  required: "Required",
                  minLength: { value: 8, message: "At least 8 characters" },
                })}
              />
              {errors.next && (
                <p className="text-xs text-destructive">{errors.next.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm new password</Label>
              <Input
                id="confirm"
                type={show ? "text" : "password"}
                autoComplete="new-password"
                {...register("confirm", {
                  required: "Required",
                  validate: (v) => v === nextValue || "Passwords do not match",
                })}
              />
              {errors.confirm && (
                <p className="text-xs text-destructive">{errors.confirm.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {show ? "Hide" : "Show"} passwords
              </button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating…" : "Update password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
