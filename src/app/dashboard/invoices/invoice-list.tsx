"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Search, Eye, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";

export function InvoiceList({ initialInvoices }: { initialInvoices: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInvoices = initialInvoices.filter((inv) => 
    inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (inv.customerName && inv.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (inv.customerPhone && inv.customerPhone.includes(searchQuery))
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by invoice #, customer name or phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-black/40 border-white/10"
          />
        </div>
      </div>

      <div className="glass-card rounded-2xl flex-1 flex flex-col overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <EmptyState 
              icon={FileText} 
              title="No Invoices Found" 
              description={searchQuery ? "Try adjusting your search terms." : "You haven't generated any bills yet."} 
            />
          </div>
        ) : (
          <div className="overflow-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-black/40 text-muted-foreground sticky top-0 z-10 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4">Invoice #</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4 text-center">Items</th>
                  <th className="px-6 py-4">Payment Mode</th>
                  <th className="px-6 py-4 text-right">Total Amount</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium text-primary">
                      {inv.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {format(new Date(inv.date), "dd MMM yyyy, hh:mm a")}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{inv.customerName || "Walk-in Customer"}</p>
                      {inv.customerPhone && <p className="text-xs text-muted-foreground">{inv.customerPhone}</p>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center bg-white/5 px-2 py-1 rounded-md text-xs font-medium">
                        {inv.items?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium " + (
                        inv.paymentMode === 'CASH' ? 'bg-success/10 text-success' : 
                        inv.paymentMode === 'UPI' ? 'bg-primary/10 text-primary' : 
                        'bg-white/10 text-foreground'
                      )}>
                        {inv.paymentMode}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-foreground">
                      ₹{inv.grandTotal.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link href={"/dashboard/invoices/" + inv.id}>
                        <Button variant="ghost" size="sm" className="hover:bg-primary/20 hover:text-primary transition-colors">
                          <Eye className="w-4 h-4 mr-2" /> View Bill
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
