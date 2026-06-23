"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateShopSettings } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save } from "lucide-react";

const settingsSchema = z.object({
  name: z.string().min(2, "Shop name is required"),
  gstin: z.string().min(1, "GSTIN is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.string().email("Valid email is required"),
  address: z.string().min(1, "Address is required"),
  invoicePrefix: z.string().min(1, "Invoice prefix is required"),
  invoiceFooter: z.string().optional(),
});

type SettingsFormProps = {
  initialData: any;
};

export function SettingsForm({ initialData }: SettingsFormProps) {
  const [isPending, setIsPending] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: initialData?.name || "M R Cell Point",
      gstin: initialData?.gstin || "",
      phoneNumber: initialData?.phoneNumber || "",
      email: initialData?.email || "",
      address: initialData?.address || "",
      invoicePrefix: initialData?.invoicePrefix || "INV-",
      invoiceFooter: initialData?.invoiceFooter || "Thank you for your business!",
    }
  });

  const onSubmit = async (data: z.infer<typeof settingsSchema>) => {
    setIsPending(true);
    const result = await updateShopSettings(data);
    
    if (result.success) {
      toast.success("Shop settings updated successfully.");
    } else {
      toast.error(result.error);
    }
    setIsPending(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium border-b pb-2 mb-4">Basic Information</h3>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="name">Shop Name</Label>
            <Input id="name" {...register("name")} className={errors.name ? "border-destructive" : ""} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="gstin">GSTIN Number</Label>
            <Input id="gstin" {...register("gstin")} className={errors.gstin ? "border-destructive" : ""} />
            {errors.gstin && <p className="text-xs text-destructive">{errors.gstin.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phoneNumber">Contact Phone</Label>
            <Input id="phoneNumber" {...register("phoneNumber")} className={errors.phoneNumber ? "border-destructive" : ""} />
            {errors.phoneNumber && <p className="text-xs text-destructive">{errors.phoneNumber.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" {...register("email")} className={errors.email ? "border-destructive" : ""} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium border-b pb-2 mb-4">Billing & Address</h3>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address">Shop Address</Label>
            <Textarea id="address" rows={3} {...register("address")} className={errors.address ? "border-destructive" : ""} />
            {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="invoicePrefix">Invoice Number Prefix</Label>
            <Input id="invoicePrefix" {...register("invoicePrefix")} className={errors.invoicePrefix ? "border-destructive" : ""} />
            <p className="text-xs text-muted-foreground">e.g. INV- will generate INV-0001, INV-0002</p>
            {errors.invoicePrefix && <p className="text-xs text-destructive">{errors.invoicePrefix.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="invoiceFooter">Invoice Footer Message</Label>
            <Textarea id="invoiceFooter" rows={2} {...register("invoiceFooter")} />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button type="submit" disabled={isPending} className="w-full md:w-auto">
          <Save className="mr-2 h-4 w-4" />
          {isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}
