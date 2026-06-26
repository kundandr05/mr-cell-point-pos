"use client";

import { Printer, MessageCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteInvoice } from "@/app/dashboard/invoices/actions";

interface InvoiceActionsProps {
  invoiceData: {
    id: string;
    invoiceNumber: string;
    customerPhone: string | null;
    customerName: string | null;
    grandTotal: number;
    date: Date;
  };
}

export function InvoiceActions({ invoiceData }: InvoiceActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleWhatsAppShare = () => {
    if (!invoiceData.customerPhone) {
      alert("No customer phone number available.");
      return;
    }

    const message = `*MR CELL POINT*\n\nHello ${invoiceData.customerName || 'Valued Customer'},\n\nThank you for shopping with us! Here is the summary of your recent purchase.\n\n*Invoice No:* ${invoiceData.invoiceNumber}\n*Date:* ${new Date(invoiceData.date).toLocaleDateString()}\n*Total Amount:* ₹${invoiceData.grandTotal.toFixed(2)}\n\nThank you for your business!`;
    
    // Clean phone number (assumes Indian +91 if length is 10)
    let phone = invoiceData.customerPhone.replace(/\D/g, '');
    if (phone.length === 10) {
      phone = `91${phone}`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this invoice? \n\n" +
      "This action cannot be undone. The items from this invoice will be automatically returned to your inventory stock."
    );
    
    if (confirmDelete) {
      try {
        setIsDeleting(true);
        await deleteInvoice(invoiceData.id);
        router.push("/dashboard/invoices");
        router.refresh();
      } catch (e: any) {
        alert(e.message || "Failed to delete the invoice");
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button 
        onClick={handleDelete}
        variant="outline"
        disabled={isDeleting}
        className="border-red-600/30 text-red-500 hover:bg-red-600/10 hover:text-red-400 px-4 py-2 rounded-xl transition-all flex items-center gap-2"
      >
        <Trash2 className="h-5 w-5" /> {isDeleting ? "Deleting..." : "Delete Bill"}
      </Button>

      <Button 
        onClick={handleWhatsAppShare}
        variant="outline"
        className="border-green-600/30 text-green-500 hover:bg-green-600/10 hover:text-green-400 px-4 py-2 rounded-xl transition-all flex items-center gap-2"
      >
        <MessageCircle className="h-5 w-5" /> Share
      </Button>

      <Button 
        onClick={() => window.print()}
        className="bg-primary text-primary-foreground px-6 py-2 rounded-xl shadow-[0_0_20px_rgba(212,160,23,0.3)] hover:shadow-[0_0_30px_rgba(212,160,23,0.5)] transition-all flex items-center gap-2"
      >
        <Printer className="h-5 w-5" /> Print Bill
      </Button>
    </div>
  );
}
