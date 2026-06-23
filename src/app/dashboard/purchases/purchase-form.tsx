"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createPurchase } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

const itemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.string().min(1),
  purchasePrice: z.string().min(1),
  gstAmount: z.string().min(1),
});

const purchaseSchema = z.object({
  invoiceNumber: z.string().min(2, "Invoice number is required"),
  supplierId: z.string().min(1, "Supplier is required"),
  purchaseDate: z.string().min(1, "Date is required"),
  totalAmount: z.number().min(0),
  gstAmount: z.number().min(0),
  items: z.array(itemSchema).min(1, "At least one item is required"),
});

type PurchaseFormProps = {
  suppliers: { id: string; name: string }[];
  products: { id: string; name: string; sku: string; barcode: string | null; purchasePrice: number }[];
};

export function PurchaseForm({ suppliers, products }: PurchaseFormProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  
  const { register, control, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<z.infer<typeof purchaseSchema>>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      invoiceNumber: "",
      supplierId: "",
      purchaseDate: new Date().toISOString().split("T")[0],
      totalAmount: 0,
      gstAmount: 0,
      items: [],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");

  // Auto-calculate totals
  const calculateTotals = () => {
    let total = 0;
    let totalGst = 0;
    items.forEach(item => {
      const qty = parseInt(item.quantity) || 0;
      const price = parseFloat(item.purchasePrice) || 0;
      const gst = parseFloat(item.gstAmount) || 0;
      total += (qty * price) + gst;
      totalGst += gst;
    });
    setValue("totalAmount", total);
    setValue("gstAmount", totalGst);
  };

  const onSubmit = async (data: z.infer<typeof purchaseSchema>) => {
    setIsPending(true);
    const result = await createPurchase(data);
    
    if (result.success) {
      toast.success("Purchase recorded successfully.");
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
        <Plus className="mr-2 h-4 w-4" /> Record Purchase
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Purchase Invoice</DialogTitle>
          <DialogDescription>
            Enter details of the supplier invoice and items purchased to update inventory.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>Invoice Number *</Label>
                <Input {...register("invoiceNumber")} className={errors.invoiceNumber ? "border-destructive" : ""} />
              </div>
              <div className="grid gap-2">
                <Label>Date *</Label>
                <Input type="date" {...register("purchaseDate")} className={errors.purchaseDate ? "border-destructive" : ""} />
              </div>
              <div className="grid gap-2">
                <Label>Supplier *</Label>
                <Select onValueChange={(val) => setValue("supplierId", val)}>
                  <SelectTrigger className={errors.supplierId ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select Supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border rounded-md p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Items</h4>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ productId: "", quantity: "1", purchasePrice: "0", gstAmount: "0" })}>
                  <Plus className="h-4 w-4 mr-2" /> Add Item
                </Button>
              </div>
              
              {errors.items?.message && <p className="text-xs text-destructive">{errors.items.message as string}</p>}

              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-2 items-end border-b pb-4">
                  <div className="col-span-12 md:col-span-4">
                    <Label className="text-xs">Product</Label>
                    <Select 
                      onValueChange={(val) => {
                        setValue(`items.${index}.productId`, val);
                        const prod = products.find(p => p.id === val);
                        if (prod) {
                          setValue(`items.${index}.purchasePrice`, prod.purchasePrice.toString());
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name} ({p.sku})</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <Label className="text-xs">Qty</Label>
                    <Input type="number" {...register(`items.${index}.quantity` as const)} onBlur={calculateTotals} />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <Label className="text-xs">Unit Price (₹)</Label>
                    <Input type="number" step="0.01" {...register(`items.${index}.purchasePrice` as const)} onBlur={calculateTotals} />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <Label className="text-xs">GST Amount (₹)</Label>
                    <Input type="number" step="0.01" {...register(`items.${index}.gstAmount` as const)} onBlur={calculateTotals} />
                  </div>
                  <div className="col-span-12 md:col-span-2 flex justify-end">
                    <Button type="button" variant="ghost" className="text-destructive w-full" onClick={() => { remove(index); calculateTotals(); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-y-2 flex-col items-end border-t pt-4">
              <div className="flex justify-between w-64 text-sm">
                <span className="text-muted-foreground">Total GST:</span>
                <span>₹ {watch("gstAmount")?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="flex justify-between w-64 text-lg font-bold">
                <span>Grand Total:</span>
                <span>₹ {watch("totalAmount")?.toFixed(2) || "0.00"}</span>
              </div>
            </div>

          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending || items.length === 0}>
              {isPending ? "Saving..." : "Save Purchase & Update Stock"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
