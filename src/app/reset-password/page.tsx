"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { resetPasswordAction } from "./actions";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    formData.append("token", token);
    
    const result = await resetPasswordAction(formData);

    if (result.success) {
      toast.success(result.message);
      router.push("/login");
    } else {
      toast.error(result.error);
    }
    
    setIsPending(false);
  }

  if (!token) {
    return (
      <div className="p-4 text-center">
        <p className="text-destructive font-medium mb-4">Invalid or missing reset token.</p>
        <Button onClick={() => router.push("/forgot-password")} variant="outline">
          Request new link
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              required
              minLength={6}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? "Resetting..." : "Reset Password"}
        </Button>
      </CardFooter>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/40">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Reset Password</CardTitle>
          <CardDescription>
            Enter your new password below.
          </CardDescription>
        </CardHeader>
        <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </Card>
    </div>
  );
}
