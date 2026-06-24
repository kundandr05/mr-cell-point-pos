"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createProduct, generateSkuAndBarcode } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Wand2 } from "lucide-react";
import { BarcodeDisplay } from "@/components/barcode-display";

const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  sku: z.string().min(2, "SKU is required"),
  barcode: z.string().optional(),
  brandId: z.string().min(1, "Brand is required"),
  categoryId: z.string().min(1, "Category is required"),
  supplierId: z.string().optional(),
  hsnCode: z.string().optional(),
  gstPercentage: z.string().min(1, "GST % is required"),
  purchasePrice: z.string().min(1, "Purchase price is required"),
  sellingPrice: z.string().min(1, "Selling price is required"),
  stockQuantity: z.string().min(1, "Stock quantity is required"),
  reorderLevel: z.string().min(1, "Reorder level is required"),
  warrantyPeriod: z.string().optional(),
});

type ProductFormProps = {
  brands: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  suppliers: { id: string; name: string }[];
};

export function ProductForm({ brands, categories, suppliers }: ProductFormProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "", sku: "", barcode: "", brandId: "", categoryId: "", supplierId: "",
      hsnCode: "", gstPercentage: "18", purchasePrice: "0", sellingPrice: "0",
      stockQuantity: "0", reorderLevel: "5", warrantyPeriod: ""
    }
  });

  const barcodeValue = watch("barcode");

  const handleGenerateCodes = async () => {
    const { sku, barcode } = await generateSkuAndBarcode();
    setValue("sku", sku);
    setValue("barcode", barcode);
    toast.success("Generated random SKU and Barcode");
  };

  const onSubmit = async (data: z.infer<typeof productSchema>) => {
    setIsPending(true);
    const result = await createProduct(data);

    if (result.success) {
      toast.success(`Product "${data.name}" created successfully.`);
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
        <Plus className="mr-2 h-4 w-4" /> Add Product
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Enter product details or scan a barcode to begin.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 py-4">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" {...register("name")} className={errors.name ? "border-destructive" : ""} autoFocus />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="barcode">Barcode (Scan or Type)</Label>
                <div className="flex space-x-2">
                  <Input id="barcode" {...register("barcode")} placeholder="Scan barcode here..." />
                  <Button type="button" variant="outline" size="icon" onClick={handleGenerateCodes} title="Auto-generate SKU & Barcode">
                    <Wand2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {barcodeValue && (
              <div className="flex justify-center border p-2 rounded-md bg-slate-50">
                <BarcodeDisplay value={barcodeValue} height={40} />
              </div>
            )}

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input id="sku" {...register("sku")} className={errors.sku ? "border-destructive" : ""} />
              </div>
              <div className="grid gap-2">
                <Label>Brand *</Label>
                <select 
                  className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.brandId ? "border-destructive" : ""}`}
                  {...register("brandId")}
                >
                  <option value="">Select Brand</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Category *</Label>
                <select 
                  className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.categoryId ? "border-destructive" : ""}`}
                  {...register("categoryId")}
                >
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="purchasePrice">Purchase Price (₹)</Label>
                <Input id="purchasePrice" type="number" step="0.01" {...register("purchasePrice")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sellingPrice">Selling Price (₹)</Label>
                <Input id="sellingPrice" type="number" step="0.01" {...register("sellingPrice")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gstPercentage">GST %</Label>
                <select 
                  id="gstPercentage"
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("gstPercentage")}
                >
                  <option value="0">0%</option>
                  <option value="5">5%</option>
                  <option value="12">12%</option>
                  <option value="18">18%</option>
                  <option value="28">28%</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hsnCode">HSN Code</Label>
                <Input id="hsnCode" {...register("hsnCode")} />
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="stockQuantity">Initial Stock</Label>
                <Input id="stockQuantity" type="number" {...register("stockQuantity")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reorderLevel">Low Stock Alert Level</Label>
                <Input id="reorderLevel" type="number" {...register("reorderLevel")} />
              </div>
              <div className="grid gap-2">
                <Label>Supplier</Label>
                <select 
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("supplierId")}
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
