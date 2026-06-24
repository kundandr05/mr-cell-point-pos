import { getCategories } from "./actions";
import { CategoryForm } from "./category-form";
import { CategoryList } from "./category-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteCategoryButton } from "./delete-category-button";

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">Manage product categories in your store.</p>
        </div>
        <CategoryForm />
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>A list of all product categories in your inventory.</CardDescription>
        </CardHeader>
        <CardContent>
          <CategoryList initialCategories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}
