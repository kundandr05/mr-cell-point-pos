import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { InvoicePrintButton } from "@/components/invoice-print-button";
import { Logo } from "@/components/ui/logo";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const prisma = new PrismaClient();

async function getInvoice(id: string) {
  return await prisma.invoice.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        }
      }
    }
  });
}

async function getShopSettings() {
  return await prisma.shopSettings.findFirst();
}

export default async function InvoicePrintPage({ params }: { params: { id: string } }) {
  const invoice = await getInvoice(params.id);
  const settings = await getShopSettings();

  if (!invoice) return notFound();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 h-full overflow-y-auto">
      
      {/* Action Bar (Hidden when printing) */}
      <div className="flex justify-between items-center mb-8 print:hidden">
        <Link href="/dashboard/billing" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Billing
        </Link>
        <InvoicePrintButton />
      </div>

      {/* Invoice Document - Styled for Paper/Thermal Print */}
      <div className="bg-white text-black p-10 rounded-2xl shadow-2xl print:shadow-none print:p-0 print:rounded-none max-w-[800px] mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-start border-b-2 border-black/80 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="print:hidden">
              <Logo size="xl" />
            </div>
            {/* Fallback for print since gradients might not print well */}
            <div className="hidden print:flex items-center justify-center w-16 h-16 border-2 border-black rounded-full text-3xl font-black">
              M
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight">{settings?.name || "M R Cell Point"}</h1>
              <p className="text-sm font-medium mt-1">{settings?.address}</p>
              <p className="text-sm">Ph: {settings?.phoneNumber} | Email: {settings?.email}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold uppercase tracking-widest text-black/40">Tax Invoice</h2>
            <p className="text-sm font-semibold mt-2">GSTIN: {settings?.gstin}</p>
          </div>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
          <div className="space-y-1">
            <p className="text-black/60 font-semibold uppercase text-xs tracking-wider">Billed To</p>
            <p className="font-bold text-lg">{invoice.customerName || "Cash Customer"}</p>
            {invoice.customerPhone && <p>Ph: {invoice.customerPhone}</p>}
          </div>
          <div className="space-y-1 text-right">
            <p className="text-black/60 font-semibold uppercase text-xs tracking-wider">Invoice Details</p>
            <p><span className="font-semibold">Invoice No:</span> {invoice.invoiceNumber}</p>
            <p><span className="font-semibold">Date:</span> {format(new Date(invoice.date), "dd MMM yyyy")}</p>
            <p><span className="font-semibold">Time:</span> {format(new Date(invoice.date), "hh:mm a")}</p>
            <p><span className="font-semibold">Payment Mode:</span> {invoice.paymentMode}</p>
          </div>
        </div>

        {/* Item Table */}
        <table className="w-full text-left mb-8 border-collapse text-sm">
          <thead>
            <tr className="border-y-2 border-black/80 bg-black/5">
              <th className="py-3 px-2 font-bold">#</th>
              <th className="py-3 px-2 font-bold">Item Description</th>
              <th className="py-3 px-2 font-bold text-center">Qty</th>
              <th className="py-3 px-2 font-bold text-right">Rate</th>
              <th className="py-3 px-2 font-bold text-right">GST</th>
              <th className="py-3 px-2 font-bold text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10 border-b-2 border-black/80">
            {invoice.items.map((item, index) => (
              <tr key={item.id} className="group">
                <td className="py-3 px-2 text-black/60">{index + 1}</td>
                <td className="py-3 px-2">
                  <p className="font-bold">{item.product.name}</p>
                  <p className="text-xs text-black/60">HSN: {item.product.hsnCode || "N/A"} | SKU: {item.product.sku}</p>
                </td>
                <td className="py-3 px-2 text-center font-medium">{item.quantity}</td>
                <td className="py-3 px-2 text-right font-medium">₹{item.rate.toFixed(2)}</td>
                <td className="py-3 px-2 text-right">
                  {item.gstPercent}%<br/>
                  <span className="text-xs text-black/60">₹{item.gstAmount.toFixed(2)}</span>
                </td>
                <td className="py-3 px-2 text-right font-bold">₹{item.totalAmount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary Section */}
        <div className="flex justify-between items-start">
          <div className="w-1/2 pr-8 text-sm text-black/70">
            <p className="font-bold text-black mb-2 uppercase text-xs tracking-wider">Terms & Conditions</p>
            <p>1. Goods once sold will not be taken back.</p>
            <p>2. Warranty as per company policy.</p>
            <p>3. Subject to local jurisdiction.</p>
          </div>

          <div className="w-1/2">
            <div className="space-y-2 text-sm border-b border-black/20 pb-4 mb-4">
              <div className="flex justify-between">
                <span className="font-semibold text-black/60">Subtotal</span>
                <span className="font-bold">₹{invoice.subtotal.toFixed(2)}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span className="font-semibold">Discount</span>
                  <span className="font-bold">-₹{invoice.discount.toFixed(2)}</span>
                </div>
              )}
              {invoice.cgst > 0 && (
                <div className="flex justify-between">
                  <span className="font-semibold text-black/60">CGST</span>
                  <span>₹{invoice.cgst.toFixed(2)}</span>
                </div>
              )}
              {invoice.sgst > 0 && (
                <div className="flex justify-between">
                  <span className="font-semibold text-black/60">SGST</span>
                  <span>₹{invoice.sgst.toFixed(2)}</span>
                </div>
              )}
              {invoice.igst > 0 && (
                <div className="flex justify-between">
                  <span className="font-semibold text-black/60">IGST</span>
                  <span>₹{invoice.igst.toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center bg-black/5 p-4 rounded-lg">
              <span className="text-lg font-black uppercase tracking-wider">Grand Total</span>
              <span className="text-2xl font-black">₹{invoice.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Signature Area */}
        <div className="mt-20 pt-8 flex justify-between items-end">
          <div className="text-center">
            <div className="w-40 border-b border-black border-dashed mb-2"></div>
            <p className="text-xs font-semibold uppercase tracking-wider text-black/60">Customer Signature</p>
          </div>
          <div className="text-center">
            <div className="w-40 border-b border-black mb-2"></div>
            <p className="text-xs font-semibold uppercase tracking-wider text-black/60">Authorized Signatory</p>
            <p className="text-[10px] text-black/40 mt-1">For {settings?.name}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
