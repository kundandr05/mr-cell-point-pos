import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { InvoiceActions } from "@/components/invoice-actions";
import { BrandLogo } from "@/components/common/BrandLogo";
import { Barcode } from "@/components/common/Barcode";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { numberToWords } from "@/lib/utils";

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

export default async function InvoicePrintPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const invoice = await getInvoice(resolvedParams.id);
  const settings = await getShopSettings();

  if (!invoice) return notFound();

  const qrData = `UPI://pay?pn=${encodeURIComponent(settings?.name || "Shop")}&am=${invoice.grandTotal}&tr=${invoice.invoiceNumber}`;

  const totalTaxable = invoice.items.reduce((acc, item) => acc + (item.totalAmount - item.gstAmount), 0);
  const totalCgst = invoice.cgst;
  const totalSgst = invoice.sgst;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 h-full overflow-y-auto print:p-0 print:m-0 print:w-full print:max-w-none print:overflow-visible">
      
      {/* Action Bar (Hidden when printing) */}
      <div className="flex justify-between items-center mb-8 print:hidden">
        <Link href="/dashboard/invoices" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to History
        </Link>
        <InvoiceActions 
          invoiceData={{
            invoiceNumber: invoice.invoiceNumber,
            customerPhone: invoice.customerPhone,
            customerName: invoice.customerName,
            grandTotal: invoice.grandTotal,
            date: invoice.date,
          }}
        />
      </div>

      {/* Invoice Document - Styled for Paper/Thermal Print */}
      <div id="invoice-print-area" className="bg-white text-black p-4 md:p-10 rounded-2xl shadow-[0_0_50px_rgba(212,160,23,0.1)] print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-none print:rounded-none max-w-[800px] mx-auto relative overflow-hidden font-sans">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row print:flex-row justify-between items-start border-b-2 border-black pb-4 mb-4 pt-2 gap-4">
          <div className="flex items-center gap-2 md:gap-4">
            <div>
              <BrandLogo size="lg" glow={false} animated={false} />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight">{settings?.name || "MR CELL POINT"}</h1>
              <p className="text-sm font-bold uppercase tracking-wider text-black/70">Mobile Accessories</p>
              <p className="text-xs font-medium mt-1">{settings?.address}</p>
              <p className="text-xs font-medium">Ph: {settings?.phoneNumber} | Email: {settings?.email}</p>
            </div>
          </div>
          <div className="text-left md:text-right print:text-right flex flex-col items-start md:items-end print:items-end w-full md:w-auto">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest bg-black text-white px-3 py-1 inline-block">Tax Invoice</h2>
            <p className="text-xs md:text-sm font-bold mt-2">GSTIN: {settings?.gstin}</p>
            <div className="mt-2 opacity-80 self-start md:self-end print:self-end">
              <Barcode value={invoice.invoiceNumber} />
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4 md:gap-8 mb-6 text-sm border-b-2 border-black pb-4">
          <div className="space-y-1">
            <p className="text-black/60 font-bold uppercase text-[10px] tracking-wider mb-1">Billed To</p>
            <p className="font-extrabold text-base uppercase">{invoice.customerName || "Cash Customer"}</p>
            {invoice.customerPhone && <p className="font-medium">Ph: {invoice.customerPhone}</p>}
          </div>
          <div className="space-y-1 text-left md:text-right print:text-right">
            <p className="text-black/60 font-bold uppercase text-[10px] tracking-wider mb-1">Invoice Details</p>
            <p><span className="font-bold">Invoice No:</span> {invoice.invoiceNumber}</p>
            <p><span className="font-bold">Date:</span> {format(new Date(invoice.date), "dd MMM yyyy")}</p>
            <p><span className="font-bold">Time:</span> {format(new Date(invoice.date), "hh:mm a")}</p>
            <p><span className="font-bold">Payment Mode:</span> {invoice.paymentMode}</p>
          </div>
        </div>

        {/* Item Table */}
        <div className="w-full overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse text-xs min-w-[600px]">
          <thead>
            <tr className="border-y border-black bg-black/5 uppercase">
              <th className="py-2 px-1 font-bold w-[5%]">Sl</th>
              <th className="py-2 px-1 font-bold w-[35%]">Product</th>
              <th className="py-2 px-1 font-bold text-center">HSN</th>
              <th className="py-2 px-1 font-bold text-center">Qty</th>
              <th className="py-2 px-1 font-bold text-right">Rate</th>
              <th className="py-2 px-1 font-bold text-right">Disc</th>
              <th className="py-2 px-1 font-bold text-right">CGST</th>
              <th className="py-2 px-1 font-bold text-right">SGST</th>
              <th className="py-2 px-1 font-bold text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/20">
            {invoice.items.map((item, index) => {
              const cgst = (item.gstAmount / 2).toFixed(2);
              const sgst = (item.gstAmount / 2).toFixed(2);
              return (
                <tr key={item.id}>
                  <td className="py-3 px-1">{index + 1}</td>
                  <td className="py-3 px-1 font-bold pr-2">
                    {item.product.name}
                    <div className="text-[10px] text-black/60 font-normal mt-0.5">SKU: {item.product.sku}</div>
                  </td>
                  <td className="py-3 px-1 text-center">{item.product.hsnCode || "-"}</td>
                  <td className="py-3 px-1 text-center font-bold">{item.quantity}</td>
                  <td className="py-3 px-1 text-right">₹{item.rate.toFixed(2)}</td>
                  <td className="py-3 px-1 text-right">{item.discount > 0 ? `-₹${item.discount.toFixed(2)}` : '-'}</td>
                  <td className="py-3 px-1 text-right">₹{cgst}<br/><span className="text-[9px] text-black/50">{(item.gstPercent/2)}%</span></td>
                  <td className="py-3 px-1 text-right">₹{sgst}<br/><span className="text-[9px] text-black/50">{(item.gstPercent/2)}%</span></td>
                  <td className="py-3 px-1 text-right font-bold">₹{item.totalAmount.toFixed(2)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col-reverse md:grid md:grid-cols-2 print:grid print:grid-cols-2 gap-8 border-t-2 border-black pt-4 mb-8">
          
          {/* QR Code and Words */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold text-black/60 uppercase mb-1">Total Amount in Words</p>
              <p className="text-sm font-extrabold capitalize leading-tight mb-4">{numberToWords(invoice.grandTotal)}</p>
            </div>
            <div className="flex items-center gap-4">
              <QRCodeSVG value={qrData} size={70} />
              <div className="text-[10px] text-black/60 font-medium">
                Scan to verify<br/>invoice details<br/>or pay via UPI
              </div>
            </div>
          </div>

          {/* Tax Summary */}
          <div>
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="py-1 text-black/70 font-semibold">Subtotal</td>
                  <td className="py-1 text-right font-bold">₹{(totalTaxable + invoice.discount).toFixed(2)}</td>
                </tr>
                {invoice.discount > 0 && (
                  <tr>
                    <td className="py-1 text-black/70 font-semibold">Discount</td>
                    <td className="py-1 text-right font-bold text-red-600">-₹{invoice.discount.toFixed(2)}</td>
                  </tr>
                )}
                <tr>
                  <td className="py-1 text-black/70 font-semibold">Taxable Value</td>
                  <td className="py-1 text-right font-bold">₹{totalTaxable.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="py-1 text-black/70 font-semibold">CGST</td>
                  <td className="py-1 text-right font-bold">₹{totalCgst.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="py-1 text-black/70 font-semibold">SGST</td>
                  <td className="py-1 text-right font-bold">₹{totalSgst.toFixed(2)}</td>
                </tr>
                <tr className="border-t-2 border-black">
                  <td className="py-2 text-lg font-black uppercase">Grand Total</td>
                  <td className="py-2 text-right text-xl font-black">₹{invoice.grandTotal.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Signatures */}
        <div className="flex justify-between items-end mt-16 pt-8 text-sm">
          <div className="text-center w-40">
            <div className="border-t border-black pt-2 font-bold uppercase text-xs">Customer Signature</div>
          </div>
          <div className="text-center w-48">
            <div className="border-t border-black pt-2 font-bold uppercase text-xs">Authorized Signatory</div>
            <p className="text-[10px] text-black/50 mt-1">For MR Cell Point</p>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="border-t border-black/20 mt-8 pt-4 text-[10px] text-black/70 leading-relaxed text-center">
          <p className="font-bold text-black uppercase mb-1">Terms & Conditions</p>
          <p>Thank You for Shopping with MR Cell Point. Goods once sold will not be taken back. Warranty as per manufacturer policy.</p>
          <p>Accessories are non-refundable unless defective. Visit Again.</p>
        </div>

      </div>
    </div>
  );
}
