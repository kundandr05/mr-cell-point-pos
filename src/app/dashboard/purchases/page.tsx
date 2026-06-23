import { getPurchases, getPurchaseFormData, deletePurchase } from "./actions";
import { PurchaseForm } from "./purchase-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";

export default async function PurchasesPage() {
  const [purchases, formData] = await Promise.all([
    getPurchases(),
    getPurchaseFormData(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Purchases</h2>
          <p className="text-muted-foreground">Manage your inbound stock and supplier invoices.</p>
        </div>
        <PurchaseForm suppliers={formData.suppliers} products={formData.products} />
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
          <CardDescription>All recorded supplier invoices.</CardDescription>
        </CardHeader>
        <CardContent>
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
              {purchases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                    No purchases found. Record a purchase to add stock.
                  </TableCell>
                </TableRow>
              ) : (
                purchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="font-medium">{purchase.invoiceNumber}</TableCell>
                    <TableCell>{format(new Date(purchase.purchaseDate), "dd MMM yyyy")}</TableCell>
                    <TableCell>{purchase.supplier.name}</TableCell>
                    <TableCell>{purchase.items.reduce((acc, item) => acc + item.quantity, 0)} units</TableCell>
                    <TableCell className="text-right font-medium">₹{purchase.totalAmount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <form action={async () => {
                        "use server";
                        await deletePurchase(purchase.id);
                      }}>
                        <Button variant="ghost" size="sm" type="submit" className="text-destructive hover:bg-destructive/10" title="Delete purchase & revert stock">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
