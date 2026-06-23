"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createSupplier } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus } from "lucide-react";

const supplierSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  contactPerson: z.string().max(100).optional(),
  phoneNumber: z.string().max(20).optional(),
  suppliedItem: z.string().max(200).optional(),
  gstin: z.string().max(50).optional(),
  address: z.string().max(500).optional(),
  paymentTerms: z.string().max(200).optional(),
});

export function SupplierForm() {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof supplierSchema>>({
    resolver: zodResolver(supplierSchema),
    defaultValues: { name: "", contactPerson: "", phoneNumber: "", suppliedItem: "", gstin: "", address: "", paymentTerms: "" }
  });

  const onSubmit = async (data: z.infer<typeof supplierSchema>) => {
    setIsPending(true);
    const result = await createSupplier(data);
    
    if (result.success) {
      toast.success(`Supplier "${data.name}" created successfully.`);
      reset();
      setOpen(false);
    } else {
      toast.error(result.error);
    }
    setIsPending(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Add Supplier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Supplier</DialogTitle>
          <DialogDescription>
            Register a new vendor/supplier in the system.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Supplier Name *</Label>
                <Input id="name" {...register("name")} className={errors.name ? "border-destructive" : ""} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input id="contactPerson" {...register("contactPerson")} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" {...register("phoneNumber")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gstin">GSTIN</Label>
                <Input id="gstin" {...register("gstin")} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="suppliedItem">Items Supplied</Label>
              <Input id="suppliedItem" placeholder="e.g. Cables, Chargers" {...register("suppliedItem")} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" {...register("address")} />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Input id="paymentTerms" placeholder="e.g. Net 30" {...register("paymentTerms")} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Supplier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
