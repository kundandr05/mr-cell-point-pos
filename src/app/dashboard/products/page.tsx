import { getProducts, getProductFormData, deleteProduct } from "./actions";
import { ProductForm } from "./product-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

export default async function ProductsPage() {
  const [products, formData] = await Promise.all([
    getProducts(),
    getProductFormData(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">Manage your inventory products and stock.</p>
        </div>
        <ProductForm brands={formData.brands} categories={formData.categories} suppliers={formData.suppliers} />
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Inventory List</CardTitle>
          <CardDescription>A list of all products in your shop.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>SKU / Barcode</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground h-24">
                    No products found. Add a product to get started.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <div className="text-xs text-muted-foreground">{product.sku}</div>
                      <div className="font-mono text-xs">{product.barcode || "-"}</div>
                    </TableCell>
                    <TableCell>{product.category.name}</TableCell>
                    <TableCell>{product.brand.name}</TableCell>
                    <TableCell className="text-right">₹{product.sellingPrice}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={product.stockQuantity <= product.reorderLevel ? "destructive" : "secondary"}>
                        {product.stockQuantity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {/* Simple delete button form for now */}
                      <form action={async () => {
                        "use server";
                        await deleteProduct(product.id);
                      }}>
                        <Button variant="ghost" size="sm" type="submit" className="text-destructive hover:bg-destructive/10">
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
