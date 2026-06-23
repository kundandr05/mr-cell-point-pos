"use client";

import { useState } from "react";
import { deleteBrand } from "./actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export function DeleteBrandButton({ id, name }: { id: string, name: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    setIsPending(true);
    const result = await deleteBrand(id);
    
    if (result.success) {
      toast.success(`Brand "${name}" deleted successfully.`);
      setOpen(false);
    } else {
      toast.error(result.error);
    }
    setIsPending(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" />}>
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Brand</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the brand <strong className="text-foreground">{name}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
