"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteCategoryButton } from "./delete-category-button";
import { SearchInput } from "@/components/ui/search-input";
import { Switch } from "@/components/ui/switch";
import { toggleCategoryStatus } from "./actions";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  isActive: boolean;
}

export function CategoryList({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setCategories(categories.map(c => c.id === id ? { ...c, isActive: !currentStatus } : c));
    
    const res = await toggleCategoryStatus(id, !currentStatus);
    if (!res.success) {
      setCategories(categories);
      toast.error("Error: " + res.error);
    } else {
      toast.success(`Category is now ${!currentStatus ? 'Active' : 'Inactive'}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <SearchInput 
          placeholder="Search categories..." 
          value={searchQuery} 
          onChange={setSearchQuery} 
          className="max-w-sm w-full"
        />
      </div>
      
      <div className="rounded-md border border-[#D4A017]/20 bg-background/50 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-[#D4A017]/20">
              <TableHead>Category Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                  {searchQuery ? `No categories found matching "${searchQuery}"` : "No categories found. Add one to get started."}
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => (
                <TableRow key={category.id} className="border-[#D4A017]/10">
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={category.isActive} 
                        onCheckedChange={() => handleToggle(category.id, category.isActive)}
                      />
                      <span className="text-xs text-muted-foreground">
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DeleteCategoryButton id={category.id} name={category.name} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
