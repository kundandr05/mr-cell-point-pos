"use client";

import { Printer, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InvoiceActionsProps {
  invoiceData: {
    invoiceNumber: string;
    customerPhone: string | null;
    customerName: string | null;
    grandTotal: number;
    date: Date;
  };
}

export function InvoiceActions({ invoiceData }: InvoiceActionsProps) {
  
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

  const handleDownloadPdf = async () => {
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');

    const invoiceElement = document.getElementById("invoice-print-area");
    if (!invoiceElement) return;

    try {
      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invoiceData.invoiceNumber}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF", error);
      alert("Could not generate PDF");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button 
        onClick={handleWhatsAppShare}
        variant="outline"
        className="border-green-600/30 text-green-500 hover:bg-green-600/10 px-4 py-2 rounded-xl transition-all flex items-center gap-2"
      >
        <MessageCircle className="h-5 w-5" /> Share
      </Button>
      <Button 
        onClick={handleDownloadPdf}
        variant="outline"
        className="border-white/10 hover:bg-white/5 px-4 py-2 rounded-xl transition-all flex items-center gap-2"
      >
        <Printer className="h-5 w-5" /> Save PDF
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
