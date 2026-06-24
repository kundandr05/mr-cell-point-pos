import { getProducts, getProductFormData } from "./actions";
import { ProductForm } from "./product-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductList } from "./product-list";

export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || "";

  const [products, formData] = await Promise.all([
    getProducts(query),
    getProductFormData(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">Manage your product inventory, pricing, and stock.</p>
        </div>
        <div className="flex items-center gap-4">
          <ProductForm brands={formData.brands} categories={formData.categories} suppliers={formData.suppliers} />
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Inventory List</CardTitle>
          <CardDescription>A list of all products in your shop.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductList 
            initialProducts={products}
            brands={formData.brands}
            categories={formData.categories}
            suppliers={formData.suppliers}
          />
        </CardContent>
      </Card>
    </div>
  );
}
