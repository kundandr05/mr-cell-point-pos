"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { editBrand } from "./actions";

interface EditBrandModalProps {
  brand: {
    id: string;
    name: string;
  };
}

export function EditBrandModal({ brand }: EditBrandModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(brand.name);
  const [isPending, setIsPending] = useState(false);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Brand name is required");

    setIsPending(true);
    const result = await editBrand(brand.id, name);
    setIsPending(false);

    if (result.success) {
      toast.success("Brand updated successfully!");
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
        <DialogContent className="sm:max-w-[425px] bg-card glass-card border-white/10">
        <DialogHeader>
          <DialogTitle>Edit Brand</DialogTitle>
          <DialogDescription>
            Update the name of the brand here.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEdit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Brand Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-black/20 border-primary/20 focus-visible:ring-primary/50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-white/10 hover:bg-white/5">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || name === brand.name}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      </Dialog>
    </>
  );
}
