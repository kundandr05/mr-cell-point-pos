"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { deleteInvoice } from "./actions";
import { useRouter } from "next/navigation";

export function DeleteInvoiceButton({ invoiceId }: { invoiceId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this invoice? \n\n" +
      "This action cannot be undone. The items from this invoice will be automatically returned to your inventory stock."
    );
    
    if (confirmDelete) {
      try {
        setIsDeleting(true);
        const res = await deleteInvoice(invoiceId);
        if (!res.success) {
          alert(res.error || "Failed to delete the invoice");
        } else {
          router.refresh();
        }
      } catch (e: any) {
        alert(e.message || "Failed to delete the invoice");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      disabled={isDeleting}
      onClick={handleDelete}
      className="text-red-500 hover:bg-red-500/20 hover:text-red-400 transition-colors"
      title="Delete Invoice"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
