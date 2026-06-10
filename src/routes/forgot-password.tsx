import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { KeyRound } from "lucide-react";

export const Route = createFileRoute("/forgot-password")({ component: ForgotPasswordPage });

interface ForgotForm {
  email: string;
}

function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>({ defaultValues: { email: "" } });

  const onSubmit = async (data: ForgotForm) => {
    try {
      await forgotPassword(data.email);
      setSent(true);
      toast.success("Check your inbox for the reset link");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to send reset email");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <KeyRound className="h-5 w-5" />
            </div>
            <CardTitle>Reset your password</CardTitle>
            <CardDescription>We'll send you a link to set a new password.</CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="space-y-4 text-center">
                <p className="text-sm text-muted-foreground">
                  If an account exists, a reset link is on its way.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/login">Back to sign in</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending…" : "Send reset link"}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  <Link to="/login" className="hover:underline">Back to sign in</Link>
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
