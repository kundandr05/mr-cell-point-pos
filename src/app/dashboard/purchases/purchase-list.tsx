"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { deletePurchase } from "./actions";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import { format } from "date-fns";

interface PurchaseListProps {
  initialPurchases: any[];
}

export function PurchaseList({ initialPurchases }: PurchaseListProps) {
  const [purchases, setPurchases] = useState(initialPurchases);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);

  const filteredPurchases = purchases.filter(p => {
    const query = debouncedQuery.toLowerCase();
    return (
      p.invoiceNumber.toLowerCase().includes(query) ||
      p.supplier.name.toLowerCase().includes(query)
    );
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this purchase? This will revert the stock changes.")) return;
    
    const prev = [...purchases];
    setPurchases(purchases.filter(p => p.id !== id));
    
    const result = await deletePurchase(id);
    if (!result.success) {
      setPurchases(prev);
      toast.error(result.error);
    } else {
      toast.success("Purchase deleted and stock reverted.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Live Client Search */}
      <div className="relative max-w-sm w-full">
        <Input
          placeholder="Search by invoice # or supplier..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 bg-black/20 border-primary/20 focus-visible:ring-primary/50 pl-10"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Items</TableHead>
            <TableHead className="text-right">Total Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPurchases.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                {debouncedQuery ? `No purchases found matching "${debouncedQuery}"` : "No purchases found. Record a purchase to add stock."}
              </TableCell>
            </TableRow>
          ) : (
            filteredPurchases.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell className="font-medium">{purchase.invoiceNumber}</TableCell>
                <TableCell>{format(new Date(purchase.purchaseDate), "dd MMM yyyy")}</TableCell>
                <TableCell>{purchase.supplier.name}</TableCell>
                <TableCell>{purchase.items.reduce((acc: any, item: any) => acc + item.quantity, 0)} units</TableCell>
                <TableCell className="text-right font-medium">₹{purchase.totalAmount.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(purchase.id)}
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    title="Delete purchase & revert stock"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
