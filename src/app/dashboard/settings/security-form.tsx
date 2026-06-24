"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateSecuritySettings } from "./security-actions";
import { Eye, EyeOff } from "lucide-react";

export function SecuritySettingsForm() {
  const [isPending, setIsPending] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateSecuritySettings(formData);

    if (result.success) {
      toast.success(result.message);
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error(result.error);
    }
    
    setIsPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="newEmail">New Email (Optional)</Label>
          <Input id="newEmail" name="newEmail" type="email" placeholder="admin@example.com" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password (Optional)</Label>
          <div className="relative">
            <Input id="newPassword" name="newPassword" type={showNewPassword ? "text" : "password"} placeholder="Enter new password" />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
              onClick={() => setShowNewPassword(!showNewPassword)}
              tabIndex={-1}
            >
              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2 md:col-span-2 border-t pt-6 mt-2">
          <Label htmlFor="currentPassword">Current Password (Required)</Label>
          <div className="relative max-w-md">
            <Input id="currentPassword" name="currentPassword" type={showCurrentPassword ? "text" : "password"} placeholder="Enter current password to save changes" required />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              tabIndex={-1}
            >
              {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">You must enter your current password to save any changes.</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Security Settings"}
        </Button>
      </div>
    </form>
  );
}
