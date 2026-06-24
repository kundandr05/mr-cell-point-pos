"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteBrandButton } from "./delete-brand-button";
import { SearchInput } from "@/components/ui/search-input";
import { Switch } from "@/components/ui/switch";
import { toggleBrandStatus } from "./actions";
import { toast } from "sonner";

interface Brand {
  id: string;
  name: string;
  isActive: boolean;
  logo: string | null;
}

export function BrandList({ initialBrands }: { initialBrands: Brand[] }) {
  const [brands, setBrands] = useState(initialBrands);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = async (id: string, currentStatus: boolean) => {
    // Optimistic update
    setBrands(brands.map(b => b.id === id ? { ...b, isActive: !currentStatus } : b));
    
    const res = await toggleBrandStatus(id, !currentStatus);
    if (!res.success) {
      // Revert on failure
      setBrands(brands);
      toast.error("Error: " + res.error);
    } else {
      toast.success(`Brand is now ${!currentStatus ? 'Active' : 'Inactive'}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <SearchInput 
          placeholder="Search brands..." 
          value={searchQuery} 
          onChange={setSearchQuery} 
          className="max-w-sm w-full"
        />
      </div>
      
      <div className="rounded-md border border-[#D4A017]/20 bg-background/50 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-[#D4A017]/20">
              <TableHead>Brand Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBrands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                  {searchQuery ? `No brands found matching "${searchQuery}"` : "No brands found. Add one to get started."}
                </TableCell>
              </TableRow>
            ) : (
              filteredBrands.map((brand) => (
                <TableRow key={brand.id} className="border-[#D4A017]/10">
                  <TableCell className="font-medium">{brand.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={brand.isActive} 
                        onCheckedChange={() => handleToggle(brand.id, brand.isActive)}
                      />
                      <span className="text-xs text-muted-foreground">
                        {brand.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DeleteBrandButton id={brand.id} name={brand.name} />
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
