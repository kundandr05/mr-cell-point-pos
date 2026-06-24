import { getBrands } from "./actions";
import { Button } from "@/components/ui/button";
import { BrandForm } from "./brand-form";
import { BrandList } from "./brand-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = 'force-dynamic'

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Brands</h2>
          <p className="text-muted-foreground">Manage product brands in your store.</p>
        </div>
        <BrandForm />
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>All Brands</CardTitle>
          <CardDescription>A list of all brands currently added to your inventory.</CardDescription>
        </CardHeader>
        <CardContent>
          <BrandList initialBrands={brands} />
        </CardContent>
      </Card>
    </div>
  );
}
