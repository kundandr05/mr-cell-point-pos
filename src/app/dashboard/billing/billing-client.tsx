"use client";

import { useState, useRef, useEffect } from "react";
import { searchProducts, createInvoice } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Search, Printer, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type CartItem = {
  productId: string;
  name: string;
  sku: string;
  rate: number;
  quantity: number;
  gstPercent: number;
  gstAmount: number;
  totalAmount: number;
};

export function BillingClient() {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    id: string;
    barcode: string | null;
    sku: string;
    name: string;
    sellingPrice: number;
    gstPercentage: number;
  }[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMode, setPaymentMode] = useState<"CASH" | "UPI" | "CARD" | "SPLIT">("CASH");
  const [discount, setDiscount] = useState<number>(0);
  const [isInterState, setIsInterState] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Auto-focus search on load
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);


  const addToCart = (product: { id: string; name: string; sku: string; sellingPrice: number; gstPercentage: number }) => {
    setCart((prev) => {
      const existing = prev.find(item => item.productId === product.id);

      if (existing) {
        // Increment qty
        return prev.map(item => {
          if (item.productId === product.id) {
            const qty = item.quantity + 1;
            // Base price is extracted from selling price: SP = Base + GST -> Base = SP / (1 + GST/100)
            const baseRate = product.sellingPrice / (1 + (product.gstPercentage / 100));
            const totalBase = baseRate * qty;
            const totalGst = (product.sellingPrice * qty) - totalBase;

            return {
              ...item,
              quantity: qty,
              gstAmount: totalGst,
              totalAmount: product.sellingPrice * qty
            };
          }
          return item;
        });
      } else {
        // Add new
        const qty = 1;
        const baseRate = product.sellingPrice / (1 + (product.gstPercentage / 100));
        const totalBase = baseRate * qty;
        const totalGst = (product.sellingPrice * qty) - totalBase;

        return [...prev, {
          productId: product.id,
          name: product.name,
          sku: product.sku,
          rate: baseRate,
          quantity: qty,
          gstPercent: product.gstPercentage,
          gstAmount: totalGst,
          totalAmount: product.sellingPrice * qty
        }];
      }
    });
    
    // Focus back on search for next scan
    searchInputRef.current?.focus();
    toast.success(`Added ${product.name} to cart`);
  };

  // Handle Search
  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery.trim().length > 1) {
        const results = await searchProducts(searchQuery);
        setSearchResults(results);

        // Auto-add if exact barcode match
        if (results.length === 1 && results[0].barcode === searchQuery) {
          addToCart(results[0]);
          setSearchQuery("");
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => prev.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        const singleTotalAmount = item.totalAmount / item.quantity;
        const newTotalAmount = singleTotalAmount * newQty;
        const singleBaseRate = item.rate;
        const newTotalBase = singleBaseRate * newQty;
        const newGstAmount = newTotalAmount - newTotalBase;

        return { ...item, quantity: newQty, gstAmount: newGstAmount, totalAmount: newTotalAmount };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter(item => item.productId !== productId));
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.rate * item.quantity), 0);
  const totalGst = cart.reduce((acc, item) => acc + item.gstAmount, 0);

  const cgst = isInterState ? 0 : totalGst / 2;
  const sgst = isInterState ? 0 : totalGst / 2;
  const igst = isInterState ? totalGst : 0;

  const grandTotal = Math.max(0, subtotal + totalGst - discount);

  const handleCheckout = async () => {
    if (cart.length === 0) return toast.error("Cart is empty");
    
    setIsPending(true);
    const result = await createInvoice({
      customerName,
      customerPhone,
      paymentMode,
      subtotal,
      cgst,
      sgst,
      igst,
      grandTotal,
      discount,
      items: cart
    });

    if (result.success && result.invoiceId) {
      toast.success("Invoice generated successfully!");
      router.push(`/dashboard/invoices/${result.invoiceId}`);
    } else {
      toast.error(result.error);
      setIsPending(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F9") {
        e.preventDefault();
        handleCheckout();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, isPending, customerName, customerPhone, paymentMode, discount, isInterState]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left Panel: Search & Cart */}
      <div className="lg:col-span-2 flex flex-col space-y-4">

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            placeholder="Scan Barcode or Search by Name/SKU..."
            className="pl-10 h-12 text-lg shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchResults.length > 0 && searchQuery.length > 1 && (
            <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-md max-h-60 overflow-y-auto">
              {searchResults.map(product => (
                <div
                  key={product.id}
                  className="p-3 hover:bg-muted cursor-pointer flex justify-between border-b last:border-0"
                  onClick={() => {
                    addToCart(product);
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                >
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-muted-foreground">SKU: {product.sku} | Barcode: {product.barcode || "N/A"}</div>
                  </div>
                  <div className="font-bold">₹{product.sellingPrice}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Table */}
        <Card className="flex-1 overflow-hidden flex flex-col glass-card">
          <CardHeader className="py-4 border-b">
            <CardTitle>Current Bill</CardTitle>
          </CardHeader>
          <div className="flex-1 overflow-y-auto">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0">
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="w-24 text-center">Qty</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      Cart is empty. Scan a product to begin.
                    </TableCell>
                  </TableRow>
                ) : (
                  cart.map(item => (
                    <TableRow key={item.productId}>
                      <TableCell>
                        <div className="font-medium line-clamp-1">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.sku}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center space-x-2">
                          <Button variant="outline" size="icon-sm" className="h-6 w-6" onClick={() => updateQuantity(item.productId, -1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-4 text-center font-medium">{item.quantity}</span>
                          <Button variant="outline" size="icon-sm" className="h-6 w-6" onClick={() => updateQuantity(item.productId, 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">₹{(item.totalAmount / item.quantity).toFixed(2)}</TableCell>
                      <TableCell className="text-right font-medium">₹{item.totalAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon-sm" className="h-6 w-6 text-destructive" onClick={() => removeFromCart(item.productId)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Right Panel: Checkout details */}
      <div className="flex flex-col space-y-4">
        <Card className="glass-card">
          <CardHeader className="py-4 border-b">
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Customer Phone</Label>
              <Input placeholder="Enter phone number" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Customer Name</Label>
              <Input placeholder="Enter customer name" value={customerName} onChange={e => setCustomerName(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1 flex flex-col glass-card">
          <CardHeader className="py-4 border-b">
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="py-4 space-y-4 flex-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal (Excl. GST)</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            {!isInterState ? (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">CGST</span>
                  <span>₹{cgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">SGST</span>
                  <span>₹{sgst.toFixed(2)}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">IGST</span>
                <span>₹{igst.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm items-center pt-2">
              <span className="text-muted-foreground">Discount (₹)</span>
              <Input
                type="number"
                className="w-24 h-8 text-right"
                value={discount}
                onChange={e => setDiscount(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="flex justify-between text-sm items-center pt-2">
              <span className="text-muted-foreground">Payment Mode</span>
              <Select value={paymentMode} onValueChange={(v: "CASH" | "UPI" | "CARD" | "SPLIT" | null) => { if(v) setPaymentMode(v) }}>
                <SelectTrigger className="w-32 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="CARD">Card</SelectItem>
                  <SelectItem value="SPLIT">Split</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">Total</span>
                <span className="text-3xl font-bold text-primary">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button
              className="w-full h-12 text-lg"
              size="lg"
              onClick={handleCheckout}
              disabled={cart.length === 0 || isPending}
            >
              <Printer className="mr-2 h-5 w-5" />
              {isPending ? "Processing..." : "Checkout & Print (F9)"}
            </Button>
          </CardFooter>
        </Card>
      </div>

    </div>
  );
}
