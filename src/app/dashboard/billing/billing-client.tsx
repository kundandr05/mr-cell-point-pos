"use client";

import { useState, useRef, useEffect } from "react";
import { searchProducts, createInvoice, searchCustomers } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Search, Printer, Plus, Minus, User, Phone, CheckCircle2, LayoutGrid, Tag, BatteryCharging, Headphones, Cable, Shield, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type CartItem = {
  productId: string;
  name: string;
  sku: string;
  rate: number;
  quantity: number;
  gstPercent: number;
  gstAmount: number;
  discount: number;
  totalAmount: number;
  stockQuantity: number;
  brandName?: string;
  image?: string | null;
};

type Customer = {
  id: string;
  name: string;
  phone: string;
  address: string | null;
};

const QUICK_PRODUCTS = [
  { name: "Charger", icon: BatteryCharging },
  { name: "Earphones", icon: Headphones },
  { name: "USB Cable", icon: Cable },
  { name: "Temp Glass", icon: Shield },
  { name: "Back Cover", icon: Smartphone },
];

export function BillingClient({ initialProducts = [] }: { initialProducts?: any[] }) {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerResults, setCustomerResults] = useState<Customer[]>([]);
  
  const [paymentMode, setPaymentMode] = useState<"CASH" | "UPI" | "CARD" | "SPLIT">("UPI");
  const [discount, setDiscount] = useState<number>(0);
  const [isPending, setIsPending] = useState(false);
  
  // Hold / Resume Bill
  const [heldBills, setHeldBills] = useState<any[]>([]);
  useEffect(() => {
    const saved = localStorage.getItem("heldBills");
    if (saved) setHeldBills(JSON.parse(saved));
  }, []);

  const holdBill = () => {
    if (cart.length === 0) return toast.error("Cart is empty");
    const newHeld = [...heldBills, { id: Date.now(), cart, customerName, customerPhone, discount }];
    setHeldBills(newHeld);
    localStorage.setItem("heldBills", JSON.stringify(newHeld));
    setCart([]); setCustomerName(""); setCustomerPhone(""); setDiscount(0);
    toast.success("Bill put on hold");
  };

  const resumeBill = (id: number) => {
    const bill = heldBills.find(b => b.id === id);
    if (!bill) return;
    setCart(bill.cart);
    setCustomerName(bill.customerName);
    setCustomerPhone(bill.customerPhone);
    setDiscount(bill.discount);
    const newHeld = heldBills.filter(b => b.id !== id);
    setHeldBills(newHeld);
    localStorage.setItem("heldBills", JSON.stringify(newHeld));
    toast.success("Bill resumed");
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F2") { e.preventDefault(); searchInputRef.current?.focus(); }
      if (e.key === "F4") { e.preventDefault(); document.getElementById("customer-phone")?.focus(); }
      if (e.key === "F6") { e.preventDefault(); document.getElementById("payment-mode-trigger")?.focus(); }
      if (e.key === "F8") { e.preventDefault(); /* Print logic if on invoice page */ }
      if (e.key === "F9") { e.preventDefault(); handleCheckout(); }
      if (e.key === "Escape") { e.preventDefault(); setCart([]); setCustomerName(""); setCustomerPhone(""); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cart, customerName, customerPhone, paymentMode, discount]);

  const searchResults = searchQuery.trim().length < 2 ? [] : initialProducts.filter(p => {
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) ||
           p.sku.toLowerCase().includes(q) ||
           (p.barcode && p.barcode.toLowerCase().includes(q));
  }).slice(0, 10);

  // Auto-add if exact barcode match
  useEffect(() => {
    if (searchResults.length === 1 && searchResults[0].barcode === searchQuery) {
      addToCart(searchResults[0]);
      setSearchQuery("");
    }
  }, [searchQuery, searchResults]);

  // Customer Search
  useEffect(() => {
    const fetchCustomers = async () => {
      if (customerPhone.trim().length >= 4) {
        const results = await searchCustomers(customerPhone);
        setCustomerResults(results);
      } else {
        setCustomerResults([]);
      }
    };

    const debounce = setTimeout(fetchCustomers, 300);
    return () => clearTimeout(debounce);
  }, [customerPhone]);

  const selectCustomer = (customer: Customer) => {
    setCustomerName(customer.name);
    setCustomerPhone(customer.phone);
    setCustomerResults([]);
  };

  const addToCart = (product: any) => {
    if (product.stockQuantity <= 0) {
      toast.error(`Out of stock: ${product.name}`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find(item => item.productId === product.id);

      if (existing) {
        if (existing.quantity >= product.stockQuantity) {
          toast.error(`Cannot add more. Only ${product.stockQuantity} in stock.`);
          return prev;
        }

        return prev.map(item => {
          if (item.productId === product.id) {
            const qty = item.quantity + 1;
            const baseRate = product.sellingPrice / (1 + (product.gstPercentage / 100));
            const totalBase = baseRate * qty;
            const totalGst = (product.sellingPrice * qty) - totalBase;

            return {
              ...item,
              quantity: qty,
              gstAmount: totalGst,
              totalAmount: (product.sellingPrice * qty) - item.discount
            };
          }
          return item;
        });
      } else {
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
          discount: 0,
          gstAmount: totalGst,
          totalAmount: product.sellingPrice * qty,
          stockQuantity: product.stockQuantity,
          brandName: product.brand?.name,
          image: product.image
        }];
      }
    });
    
    searchInputRef.current?.focus();
    toast.success(`Added ${product.name}`);
  };

  const updateQuantity = (productId: string, newQty: number) => {
    setCart((prev) => prev.map(item => {
      if (item.productId === productId) {
        if (newQty > item.stockQuantity) {
          toast.error(`Cannot add more. Only ${item.stockQuantity} in stock.`);
          return item;
        }
        if (newQty < 1) return item;

        const singleBaseRate = item.rate;
        const newTotalBase = singleBaseRate * newQty;
        // rate * (1 + gst/100) = sellingPrice
        const sellingPrice = singleBaseRate * (1 + (item.gstPercent / 100));
        const newTotalAmount = (sellingPrice * newQty) - item.discount;
        const newGstAmount = (sellingPrice * newQty) - newTotalBase;

        return { ...item, quantity: newQty, gstAmount: newGstAmount, totalAmount: newTotalAmount };
      }
      return item;
    }));
  };
  
  const updateItemDiscount = (productId: string, newDiscount: number) => {
    setCart((prev) => prev.map(item => {
      if (item.productId === productId) {
        const singleBaseRate = item.rate;
        const newTotalBase = singleBaseRate * item.quantity;
        const sellingPrice = singleBaseRate * (1 + (item.gstPercent / 100));
        const newTotalAmount = (sellingPrice * item.quantity) - newDiscount;
        return { ...item, discount: newDiscount, totalAmount: newTotalAmount };
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
  const cgst = totalGst / 2;
  const sgst = totalGst / 2;
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
      igst: 0,
      grandTotal,
      discount,
      items: cart
    });

    if (result.success && result.invoiceId) {
      toast.success("Invoice generated successfully!");
      // We will route to print preview page
      router.push(`/dashboard/invoices/${result.invoiceId}`);
    } else {
      toast.error(result.error);
      setIsPending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full pb-10">
      
      {/* LEFT COLUMN: Search & Products (Spans 8) */}
      <div className="lg:col-span-8 flex flex-col space-y-6">
        
        {/* Product Search & Quick Add Bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-card glass-card rounded-2xl p-5 border border-white/5 relative">
            <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
              <Search className="w-4 h-4" /> Find Product
            </h2>
            <div className="relative">
              <Input
                ref={searchInputRef}
                placeholder="Scan barcode or type name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 text-lg bg-black/40 border-primary/20 focus-visible:ring-primary/50 pl-12 rounded-xl"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            </div>

            {/* Search Dropdown */}
            <AnimatePresence>
              {searchQuery.trim().length > 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 right-0 top-full mt-2 z-50 bg-card/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-[300px] overflow-y-auto"
                >
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground text-sm">No products found</div>
                  ) : (
                    searchResults.map((product) => (
                      <div 
                        key={product.id}
                        onClick={() => {
                          addToCart(product);
                          setSearchQuery("");
                        }}
                        className={`p-4 border-b border-white/5 cursor-pointer flex justify-between items-center transition-colors ${
                          product.stockQuantity > 0 ? "hover:bg-white/5" : "opacity-50 cursor-not-allowed bg-red-500/5"
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-foreground flex items-center gap-2">
                            {product.image && <img src={product.image} alt="" className="w-6 h-6 rounded object-cover" />}
                            {product.name}
                            {product.stockQuantity <= 0 && (
                              <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full uppercase tracking-wider">Out of Stock</span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">SKU: {product.sku} | Stock: {product.stockQuantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">₹{product.sellingPrice}</p>
                          <p className="text-xs text-muted-foreground">Inc. GST</p>
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Browse Catalog */}
          <div className="bg-card glass-card rounded-2xl p-5 border border-white/5 flex flex-col flex-1 min-h-[250px]">
            <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" /> Browse Catalog
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 overflow-y-auto pr-2 pb-2 content-start">
              {initialProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  disabled={p.stockQuantity <= 0}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg bg-black/20 hover:bg-primary/20 border border-white/5 transition-all group text-center h-28 ${p.stockQuantity <= 0 ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:border-primary/30'}`}
                >
                  <span className="text-xs font-medium text-foreground line-clamp-2 mb-1">{p.name}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">Stock: {p.stockQuantity}</span>
                  <span className="text-sm font-bold text-primary mt-auto">₹{p.sellingPrice}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Current Bill Table */}
        <div className="flex-1 bg-card glass-card rounded-2xl border border-white/5 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-white/5 flex justify-between items-center bg-black/20">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Tag className="w-5 h-5 text-primary" /> Current Bill
            </h2>
            <div className="text-sm text-muted-foreground bg-black/40 px-3 py-1 rounded-full border border-white/5">
              {cart.length} Items
            </div>
            <div className="ml-4 flex gap-2">
              <Button size="sm" variant="outline" onClick={holdBill} className="h-8">Hold</Button>
              {heldBills.length > 0 && (
                <Select onValueChange={(val) => resumeBill(Number(val))}>
                  <SelectTrigger className="h-8 w-24"><SelectValue placeholder="Resume" /></SelectTrigger>
                  <SelectContent>
                    {heldBills.map((b) => (
                      <SelectItem key={b.id} value={b.id.toString()}>{b.customerName || 'Walk-in'} (₹{b.cart.reduce((acc: number, item: any) => acc + item.totalAmount, 0).toFixed(0)})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-0">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 py-20">
                <div className="w-16 h-16 rounded-full bg-black/40 flex items-center justify-center border border-white/5">
                  <Search className="w-8 h-8 opacity-50" />
                </div>
                <p>Scan a barcode or search for a product to begin</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-black/40 text-muted-foreground sticky top-0">
                  <tr>
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium text-center">Qty</th>
                    <th className="px-4 py-3 font-medium text-right">Rate</th>
                    <th className="px-4 py-3 font-medium text-right">Discount</th>
                    <th className="px-4 py-3 font-medium text-right">Total</th>
                    <th className="px-4 py-3 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence>
                    {cart.map((item) => (
                      <motion.tr 
                        key={item.productId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-4 py-4 flex items-center gap-3">
                          {item.image && <img src={item.image} alt="" className="w-10 h-10 rounded object-cover border border-white/10" />}
                          <div>
                            <p className="font-medium text-foreground">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.sku} | GST: {item.gstPercent}%</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-6 h-6 rounded-md bg-black/40 flex items-center justify-center hover:bg-white/10 transition-colors">
                              <Minus className="w-3 h-3" />
                            </button>
                            <Input type="number" value={item.quantity} onChange={(e) => updateQuantity(item.productId, Number(e.target.value))} className="w-12 h-8 text-center bg-black/40 border-white/10" />
                            <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-6 h-6 rounded-md bg-black/40 flex items-center justify-center hover:bg-white/10 transition-colors">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">₹{item.rate.toFixed(2)}</td>
                        <td className="px-4 py-4 text-right">
                          <Input type="number" value={item.discount} onChange={(e) => updateItemDiscount(item.productId, Number(e.target.value))} className="w-16 h-8 ml-auto text-right bg-black/40 border-white/10" />
                        </td>
                        <td className="px-4 py-4 text-right font-bold text-primary">₹{item.totalAmount.toFixed(2)}</td>
                        <td className="px-4 py-4 text-center">
                          <button 
                            onClick={() => removeFromCart(item.productId)}
                            className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Customer & Payment (Spans 4) */}
      <div className="lg:col-span-4 flex flex-col space-y-6">
        
        {/* Customer Bento */}
        <div className="bg-card glass-card rounded-2xl p-5 border border-white/5 relative">
          <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4" /> Customer Details
          </h2>
          <div className="space-y-4 relative">
            <div className="relative">
              <Label className="text-xs text-muted-foreground mb-1 block">Mobile Number</Label>
              <div className="relative">
                <Input
                  placeholder="Enter phone number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  id="customer-phone"
                  className="bg-black/40 border-white/10 pl-10 h-11 rounded-xl"
                />
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
              
              {/* Customer Auto-Search Dropdown */}
              <AnimatePresence>
                {customerResults.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-0 right-0 top-full mt-1 z-50 bg-card border border-white/10 rounded-xl shadow-xl overflow-hidden"
                  >
                    {customerResults.map((c) => (
                      <div 
                        key={c.id}
                        onClick={() => selectCustomer(c)}
                        className="p-3 border-b border-white/5 hover:bg-primary/10 cursor-pointer flex items-center gap-3 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.phone}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Customer Name</Label>
              <Input
                placeholder="Enter full name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="bg-black/40 border-white/10 h-11 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Payment Summary Bento */}
        <div className="flex-1 bg-card glass-card rounded-2xl p-6 border border-primary/20 shadow-[0_0_30px_rgba(212,160,23,0.05)] flex flex-col">
          <h2 className="text-sm font-medium text-muted-foreground mb-6 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" /> Payment Summary
          </h2>
          
          <div className="space-y-3 flex-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">CGST</span>
              <span className="font-medium">₹{cgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">SGST</span>
              <span className="font-medium">₹{sgst.toFixed(2)}</span>
            </div>
            
            <div className="pt-3 border-t border-white/5">
              <Label className="text-xs text-muted-foreground mb-2 block">Extra Discount (₹)</Label>
              <Input
                type="number"
                value={discount || ""}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="bg-black/40 border-white/10 h-10 text-right font-medium rounded-xl"
                placeholder="0.00"
              />
            </div>

            <div className="pt-4 mt-auto">
              <Label className="text-xs text-muted-foreground mb-2 block">Payment Mode</Label>
              <Select value={paymentMode} onValueChange={(val: any) => setPaymentMode(val)}>
                <SelectTrigger id="payment-mode-trigger" className="w-full bg-black/40 border-white/10 h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UPI">UPI / QR Code</SelectItem>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="CARD">Credit/Debit Card</SelectItem>
                  <SelectItem value="SPLIT">Split Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex justify-between items-end mb-6">
              <span className="text-lg font-medium text-muted-foreground">Grand Total</span>
              <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#D4A017] to-[#F3E5AB]">
                ₹{grandTotal.toFixed(2)}
              </span>
            </div>
            
            <Button 
              className="w-full h-14 text-lg font-bold rounded-xl shadow-[0_0_20px_rgba(212,160,23,0.3)] hover:shadow-[0_0_30px_rgba(212,160,23,0.5)] transition-all"
              onClick={handleCheckout}
              disabled={cart.length === 0 || isPending}
            >
              {isPending ? "Processing..." : (
                <>
                  <Printer className="mr-2 w-5 h-5" /> Generate Bill (F9)
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
