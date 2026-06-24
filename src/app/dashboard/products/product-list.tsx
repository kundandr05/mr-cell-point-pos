"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EditProductModal } from "./edit-product-modal";
import { deleteProduct } from "./actions";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";

interface ProductListProps {
  initialProducts: any[];
  brands: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  suppliers: { id: string; name: string }[];
}

export function ProductList({ initialProducts, brands, categories, suppliers }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);

  const filteredProducts = products.filter(p => {
    const query = debouncedQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(query) ||
      p.sku.toLowerCase().includes(query) ||
      (p.barcode && p.barcode.toLowerCase().includes(query)) ||
      p.brand.name.toLowerCase().includes(query) ||
      p.category.name.toLowerCase().includes(query)
    );
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    // Optimistic UI update
    const prevProducts = [...products];
    setProducts(products.filter(p => p.id !== id));
    
    const result = await deleteProduct(id);
    if (!result.success) {
      setProducts(prevProducts);
      toast.error(result.error);
    } else {
      toast.success("Product deleted");
    }
  };

  return (
    <div className="space-y-4">
      {/* Live Client Search */}
      <div className="relative max-w-sm w-full">
        <Input
          placeholder="Search live..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 bg-black/20 border-primary/20 focus-visible:ring-primary/50 pl-10"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
      </div>

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
          {filteredProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground h-24">
                {debouncedQuery ? `No products found matching "${debouncedQuery}"` : "No products found. Add a product to get started."}
              </TableCell>
            </TableRow>
          ) : (
            filteredProducts.map((product) => (
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
                  <div className="flex items-center justify-end gap-2">
                    <EditProductModal 
                      product={product} 
                      brands={brands} 
                      categories={categories} 
                      suppliers={suppliers} 
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(product.id)}
                      className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
