import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Printer } from "lucide-react";

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
    <div className="max-w-3xl mx-auto py-8">
      {/* Hide this action bar when printing */}
      <div className="flex justify-end mb-8 print:hidden">
        <button 
          onClick={() => window.print()}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-sm hover:bg-primary/90 flex items-center"
        >
          <Printer className="mr-2 h-4 w-4" /> Print Invoice
        </button>
      </div>

      {/* Invoice Document (A4 / Thermal adapted via CSS) */}
      <div className="bg-white text-black p-8 rounded-lg border shadow-sm print:shadow-none print:border-none print:p-0">
        <div className="text-center mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold uppercase">{settings?.name || "SHOP NAME"}</h1>
          <p className="text-sm">{settings?.address}</p>
          <p className="text-sm">Phone: {settings?.phoneNumber} | GSTIN: {settings?.gstin}</p>
        </div>

        <div className="flex justify-between mb-8 text-sm">
          <div>
            <p><span className="font-semibold">Invoice No:</span> {invoice.invoiceNumber}</p>
            <p><span className="font-semibold">Date:</span> {format(new Date(invoice.date), "dd MMM yyyy, hh:mm a")}</p>
          </div>
          <div className="text-right">
            <p><span className="font-semibold">Customer:</span> {invoice.customerName || "Cash Customer"}</p>
            {invoice.customerPhone && <p><span className="font-semibold">Phone:</span> {invoice.customerPhone}</p>}
          </div>
        </div>

        <table className="w-full text-left mb-8 border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-black/20">
              <th className="py-2">Item</th>
              <th className="py-2 text-center">Qty</th>
              <th className="py-2 text-right">Rate</th>
              <th className="py-2 text-right">GST</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} className="border-b border-black/10">
                <td className="py-2">
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-xs text-gray-500">HSN: {item.product.hsnCode || "N/A"}</p>
                </td>
                <td className="py-2 text-center">{item.quantity}</td>
                <td className="py-2 text-right">₹{item.rate.toFixed(2)}</td>
                <td className="py-2 text-right">{item.gstPercent}%<br/><span className="text-xs">₹{item.gstAmount.toFixed(2)}</span></td>
                <td className="py-2 text-right font-medium">₹{item.totalAmount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end text-sm">
          <div className="w-64 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{invoice.subtotal.toFixed(2)}</span>
            </div>
            {invoice.cgst > 0 && (
              <div className="flex justify-between">
                <span>CGST:</span>
                <span>₹{invoice.cgst.toFixed(2)}</span>
              </div>
            )}
            {invoice.sgst > 0 && (
              <div className="flex justify-between">
                <span>SGST:</span>
                <span>₹{invoice.sgst.toFixed(2)}</span>
              </div>
            )}
            {invoice.igst > 0 && (
              <div className="flex justify-between">
                <span>IGST:</span>
                <span>₹{invoice.igst.toFixed(2)}</span>
              </div>
            )}
            {invoice.discount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Discount:</span>
                <span>- ₹{invoice.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2 border-black/20">
              <span>Grand Total:</span>
              <span>₹{invoice.grandTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span>Payment Mode:</span>
              <span className="uppercase">{invoice.paymentMode}</span>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500 border-t pt-4">
          <p>{settings?.invoiceFooter || "Thank you for your business!"}</p>
        </div>
      </div>
    </div>
  );
}
