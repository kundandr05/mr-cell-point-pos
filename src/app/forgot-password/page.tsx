"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { forgotPasswordAction } from "./actions";

export default function ForgotPasswordPage() {
  const [isPending, setIsPending] = useState(false);
  const [resetLink, setResetLink] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setResetLink(null);

    const formData = new FormData(e.currentTarget);
    const result = await forgotPasswordAction(formData);

    if (result.success && result.resetLink) {
      // In a real app we'd email this. Here we show it directly.
      setResetLink(result.resetLink);
      toast.success(result.message);
    } else {
      toast.error(result.error || "An error occurred.");
    }
    
    setIsPending(false);
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/40">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Forgot Password</CardTitle>
          <CardDescription>
            Enter your admin email to receive a password reset link.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                required
              />
            </div>
            {resetLink && (
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-md mt-4">
                <p className="text-sm font-medium text-primary mb-2">Email service not configured. Use this link to reset your password:</p>
                <a href={resetLink} className="text-xs break-all text-blue-600 hover:underline">{resetLink}</a>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col space-y-4">
            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? "Sending..." : "Send Reset Link"}
            </Button>
            <div className="text-sm text-muted-foreground text-center">
              Remember your password?{" "}
              <a href="/login" className="text-primary hover:underline font-medium">
                Back to login
              </a>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
