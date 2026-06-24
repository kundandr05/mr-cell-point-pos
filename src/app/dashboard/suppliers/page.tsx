import { getSuppliers } from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SupplierForm } from "./supplier-form";
import { SupplierList } from "./supplier-list";

export const dynamic = 'force-dynamic';

export default async function SuppliersPage() {
  const suppliers = await getSuppliers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Suppliers</h2>
          <p className="text-muted-foreground">Manage your vendors and suppliers.</p>
        </div>
        <SupplierForm />
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>All Suppliers</CardTitle>
          <CardDescription>A list of all suppliers you do business with.</CardDescription>
        </CardHeader>
        <CardContent>
          <SupplierList initialSuppliers={suppliers} />
        </CardContent>
      </Card>
    </div>
  );
}
