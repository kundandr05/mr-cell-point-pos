"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EditSupplierModal } from "./edit-supplier-modal";
import { deleteSupplier } from "./actions";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";

interface SupplierListProps {
  initialSuppliers: any[];
}

export function SupplierList({ initialSuppliers }: SupplierListProps) {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);

  const filteredSuppliers = suppliers.filter(s => {
    const query = debouncedQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(query) ||
      (s.contactPerson && s.contactPerson.toLowerCase().includes(query)) ||
      (s.phoneNumber && s.phoneNumber.toLowerCase().includes(query)) ||
      (s.suppliedItem && s.suppliedItem.toLowerCase().includes(query))
    );
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this supplier?")) return;
    
    const prev = [...suppliers];
    setSuppliers(suppliers.filter(s => s.id !== id));
    
    const result = await deleteSupplier(id);
    if (!result.success) {
      setSuppliers(prev);
      toast.error(result.error);
    } else {
      toast.success("Supplier deleted");
    }
  };

  return (
    <div className="space-y-4">
      {/* Live Client Search */}
      <div className="relative max-w-sm w-full">
        <Input
          placeholder="Search suppliers live..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 bg-black/20 border-primary/20 focus-visible:ring-primary/50 pl-10"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Supplier Name</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Supplied Items</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSuppliers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                {debouncedQuery ? `No suppliers found matching "${debouncedQuery}"` : "No suppliers found. Add a supplier to get started."}
              </TableCell>
            </TableRow>
          ) : (
            filteredSuppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell className="font-medium">{supplier.name}</TableCell>
                <TableCell>{supplier.contactPerson || "-"}</TableCell>
                <TableCell>{supplier.phoneNumber || "-"}</TableCell>
                <TableCell>{supplier.suppliedItem || "-"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <EditSupplierModal supplier={supplier} />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(supplier.id)}
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
