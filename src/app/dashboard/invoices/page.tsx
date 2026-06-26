import { getInvoices } from "./actions";
import { InvoiceList } from "./invoice-list";
import { FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const invoices = await getInvoices();

  return (
    <div className="space-y-6 h-full flex flex-col pb-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="w-8 h-8 text-primary" /> Invoice History
          </h2>
          <p className="text-muted-foreground">View, search, and reprint past customer invoices.</p>
        </div>
      </div>
      
      <div className="flex-1 min-h-0">
        <InvoiceList initialInvoices={invoices} />
      </div>
    </div>
  );
}
