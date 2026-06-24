"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InvoicePrintButton() {
  return (
    <Button 
      onClick={() => window.print()}
      className="bg-primary text-primary-foreground px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
    >
      <Printer className="h-5 w-5" /> Print Invoice
    </Button>
  );
}
