import { getPurchases, getPurchaseFormData } from "./actions";
import { PurchaseForm } from "./purchase-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PurchaseList } from "./purchase-list";

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
          <PurchaseList initialPurchases={purchases} />
        </CardContent>
      </Card>
    </div>
  );
}
