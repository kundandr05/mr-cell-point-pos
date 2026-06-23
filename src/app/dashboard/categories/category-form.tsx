"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createCategory } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus } from "lucide-react";

const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters").max(50, "Category name must be less than 50 characters"),
});

export function CategoryForm() {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" }
  });

  const onSubmit = async (data: z.infer<typeof categorySchema>) => {
    setIsPending(true);
    const result = await createCategory(data.name);
    
    if (result.success) {
      toast.success(`Category "${data.name}" created successfully.`);
      reset();
      setOpen(false);
    } else {
      toast.error(result.error);
    }
    setIsPending(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="bg-primary text-primary-foreground hover:bg-primary/90" />}>
        <Plus className="mr-2 h-4 w-4" /> Add Category
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Create a new product category for your inventory.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                placeholder="e.g. Headphones"
                {...register("name")}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
