"use client";

import { useState } from "react";
import { fetchInvoiceForReturn, processReturn } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, PackageX, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ReturnsClient() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [invoice, setInvoice] = useState<any>(null);
  
  // State to track which items are being returned and how much
  const [returnItems, setReturnItems] = useState<Record<string, { qty: number, amount: number }>>({});
  const [reason, setReason] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setInvoice(null);
    setReturnItems({});
    
    const data = await fetchInvoiceForReturn(searchQuery);
    if (!data) {
      toast.error("Invoice not found");
    } else {
      setInvoice(data);
    }
    setIsLoading(false);
  };

  const handleQtyChange = (productId: string, value: number, maxQty: number, rate: number, discount: number) => {
    let qty = value;
    if (qty < 0) qty = 0;
    if (qty > maxQty) qty = maxQty;
    
    const proportion = qty / (maxQty + (invoice.items.find((i: any) => i.productId === productId)?.returnedQty || 0));
    // Approximate refund based on qty proportion of original totalAmount which includes discount
    const originalItem = invoice.items.find((i: any) => i.productId === productId);
    const refundAmount = qty === 0 ? 0 : (originalItem.totalAmount / originalItem.quantity) * qty;

    setReturnItems(prev => ({
      ...prev,
      [productId]: { qty, amount: refundAmount }
    }));
  };

  const totalRefund = Object.values(returnItems).reduce((sum, item) => sum + item.amount, 0);

  const handleSubmitReturn = async () => {
    const itemsToReturn = Object.entries(returnItems)
      .filter(([_, data]) => data.qty > 0)
      .map(([productId, data]) => ({
        productId,
        quantity: data.qty,
        refundAmount: data.amount
      }));

    if (itemsToReturn.length === 0) {
      return toast.error("Please select at least one item to return");
    }

    setIsLoading(true);
    const result = await processReturn({
      invoiceId: invoice.id,
      reason,
      items: itemsToReturn
    });

    if (result.success) {
      toast.success("Return processed successfully");
      setInvoice(null);
      setSearchQuery("");
      setReturnItems({});
      router.refresh();
    } else {
      toast.error(result.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Search & Info Panel */}
      <div className="lg:col-span-1 space-y-6">
        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" /> Find Invoice
          </h2>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., INV-000001" 
              className="bg-black/40 border-white/10 h-11"
            />
            <Button type="submit" disabled={isLoading} className="h-11 px-6">
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </form>
        </div>

        {invoice && (
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Invoice Details</h3>
            
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <span className="text-muted-foreground">Customer</span>
              <span className="font-medium">{invoice.customerName || "Walk-in"}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <span className="text-muted-foreground">Phone</span>
              <span className="font-medium">{invoice.customerPhone || "-"}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <span className="text-muted-foreground">Payment Mode</span>
              <span className="font-medium">{invoice.paymentMode}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Original Total</span>
              <span className="font-bold text-primary">₹{invoice.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Return Items Panel */}
      <div className="lg:col-span-2">
        {!invoice ? (
           <div className="glass-card p-12 rounded-2xl h-full flex flex-col items-center justify-center text-center">
             <div className="bg-[#D4A017]/10 p-6 rounded-full mb-6">
               <PackageX className="h-12 w-12 text-[#D4A017]" />
             </div>
             <h3 className="text-xl mb-2">Process a Return</h3>
             <p className="text-muted-foreground max-w-sm">
               Search for an invoice number to view its items and process returns. Inventory will automatically restock.
             </p>
           </div>
        ) : (
          <div className="glass-card rounded-2xl flex flex-col overflow-hidden h-full">
            <div className="p-5 bg-black/20 border-b border-white/5 flex items-center gap-2">
              <RefreshCcw className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Return Items</h2>
            </div>
            
            <div className="flex-1 p-0 overflow-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-black/40 text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3">Product</th>
                    <th className="px-5 py-3 text-center">Available Qty</th>
                    <th className="px-5 py-3 text-center">Return Qty</th>
                    <th className="px-5 py-3 text-right">Refund (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {invoice.items.map((item: any) => (
                    <tr key={item.id} className="hover:bg-white/[0.02]">
                      <td className="px-5 py-4">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">Rate: ₹{item.rate.toFixed(2)}</p>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="font-medium">{item.availableToReturn}</span>
                        {item.returnedQty > 0 && (
                          <span className="text-xs text-destructive ml-2">({item.returnedQty} already returned)</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <Input 
                          type="number"
                          min={0}
                          max={item.availableToReturn}
                          value={returnItems[item.productId]?.qty || 0}
                          onChange={(e) => handleQtyChange(item.productId, Number(e.target.value), item.availableToReturn, item.rate, item.discount)}
                          className="w-20 mx-auto text-center bg-black/40 h-9"
                          disabled={item.availableToReturn === 0}
                        />
                      </td>
                      <td className="px-5 py-4 text-right font-medium">
                        ₹{(returnItems[item.productId]?.amount || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-white/10 bg-black/40 mt-auto">
              <div className="mb-6">
                <Label className="mb-2 block text-muted-foreground">Reason for Return</Label>
                <Input 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Defective, Changed mind..."
                  className="bg-black/40 border-white/10 h-11"
                />
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg text-muted-foreground">Total Refund</span>
                <span className="text-3xl font-bold text-destructive">₹{totalRefund.toFixed(2)}</span>
              </div>

              <Button 
                onClick={handleSubmitReturn}
                disabled={isLoading || totalRefund === 0}
                variant="destructive"
                className="w-full h-14 text-lg font-bold"
              >
                {isLoading ? "Processing..." : "Process Return & Restock"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
