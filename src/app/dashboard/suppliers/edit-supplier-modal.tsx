"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { editSupplier, SupplierInput } from "./actions";

interface EditSupplierModalProps {
  supplier: any;
}

export function EditSupplierModal({ supplier }: EditSupplierModalProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [formData, setFormData] = useState<SupplierInput>({
    name: supplier.name,
    suppliedItem: supplier.suppliedItem || "",
    contactPerson: supplier.contactPerson || "",
    phoneNumber: supplier.phoneNumber || "",
    address: supplier.address || "",
    gstin: supplier.gstin || "",
    paymentTerms: supplier.paymentTerms || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error("Supplier name is required");

    setIsPending(true);
    const result = await editSupplier(supplier.id, formData);
    setIsPending(false);

    if (result.success) {
      toast.success("Supplier updated successfully!");
      setOpen(false);
    } else {
      toast.error(result.error);
    }
  };

  return (
    <>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => setOpen(true)}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px] bg-card glass-card border-white/10">
        <DialogHeader>
          <DialogTitle>Edit Supplier</DialogTitle>
          <DialogDescription>
            Update supplier details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEdit}>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="grid gap-2 col-span-2">
              <Label htmlFor="name">Supplier Name *</Label>
              <Input id="name" value={formData.name} onChange={handleChange} required className="bg-black/20" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input id="contactPerson" value={formData.contactPerson} onChange={handleChange} className="bg-black/20" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="bg-black/20" />
            </div>
            <div className="grid gap-2 col-span-2">
              <Label htmlFor="suppliedItem">Supplied Item(s)</Label>
              <Input id="suppliedItem" value={formData.suppliedItem} onChange={handleChange} placeholder="e.g. Displays, Batteries" className="bg-black/20" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gstin">GSTIN</Label>
              <Input id="gstin" value={formData.gstin} onChange={handleChange} className="bg-black/20" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Input id="paymentTerms" value={formData.paymentTerms} onChange={handleChange} placeholder="e.g. Net 30, Cash" className="bg-black/20" />
            </div>
            <div className="grid gap-2 col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={formData.address} onChange={handleChange} className="bg-black/20" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-white/10 hover:bg-white/5">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      </Dialog>
    </>
  );
}
