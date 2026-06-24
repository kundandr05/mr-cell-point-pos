"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { editProduct } from "./actions";

interface EditProductModalProps {
  product: any;
  brands: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  suppliers: { id: string; name: string }[];
}

export function EditProductModal({ product, brands, categories, suppliers }: EditProductModalProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const [formData, setFormData] = useState({
    sku: product.sku,
    barcode: product.barcode || "",
    name: product.name,
    brandId: product.brandId,
    categoryId: product.categoryId,
    supplierId: product.supplierId || "none",
    hsnCode: product.hsnCode || "",
    gstPercentage: product.gstPercentage.toString(),
    purchasePrice: product.purchasePrice.toString(),
    sellingPrice: product.sellingPrice.toString(),
    stockQuantity: product.stockQuantity.toString(),
    reorderLevel: product.reorderLevel.toString(),
    warrantyPeriod: product.warrantyPeriod || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.sku.trim()) return toast.error("Name and SKU are required");

    setIsPending(true);
    const result = await editProduct(product.id, {
      ...formData,
      supplierId: formData.supplierId === "none" ? null : formData.supplierId
    });
    setIsPending(false);

    if (result.success) {
      toast.success("Product updated successfully!");
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
        <DialogContent className="sm:max-w-[700px] bg-card glass-card border-white/10 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update the product details here.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 py-4">
            
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input id="name" value={formData.name} onChange={handleChange} required className="bg-black/20" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input id="sku" value={formData.sku} onChange={handleChange} required className="bg-black/20" />
            </div>

            <div className="grid gap-2">
              <Label>Category *</Label>
              <Select value={formData.categoryId} onValueChange={(val) => handleSelectChange('categoryId', val)}>
                <SelectTrigger className="bg-black/20"><SelectValue placeholder="Select Category" /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Brand *</Label>
              <Select value={formData.brandId} onValueChange={(val) => handleSelectChange('brandId', val)}>
                <SelectTrigger className="bg-black/20"><SelectValue placeholder="Select Brand" /></SelectTrigger>
                <SelectContent>
                  {brands.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="purchasePrice">Purchase Price *</Label>
              <Input id="purchasePrice" type="number" step="0.01" value={formData.purchasePrice} onChange={handleChange} required className="bg-black/20" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sellingPrice">Selling Price *</Label>
              <Input id="sellingPrice" type="number" step="0.01" value={formData.sellingPrice} onChange={handleChange} required className="bg-black/20" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="stockQuantity">Stock Quantity *</Label>
              <Input id="stockQuantity" type="number" value={formData.stockQuantity} onChange={handleChange} required className="bg-black/20" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="gstPercentage">GST Percentage *</Label>
              <Input id="gstPercentage" type="number" value={formData.gstPercentage} onChange={handleChange} required className="bg-black/20" />
            </div>

          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-white/10">
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
