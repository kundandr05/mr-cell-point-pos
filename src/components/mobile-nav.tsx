"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Receipt, Package, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export function MobileNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Bill", href: "/dashboard/billing", icon: Receipt },
    { name: "Inventory", href: "/dashboard/products", icon: Package },
  ];

  const menuItems = [
    { name: "Invoices", href: "/dashboard/invoices" },
    { name: "Purchases", href: "/dashboard/purchases" },
    { name: "Categories", href: "/dashboard/categories" },
    { name: "Brands", href: "/dashboard/brands" },
    { name: "Suppliers", href: "/dashboard/suppliers" },
    { name: "Reports", href: "/dashboard/reports" },
    { name: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/10 pb-safe">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "fill-primary/20" : ""}`} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            );
          })}
          
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-col items-center justify-center w-full h-full space-y-1 text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-medium">Menu</span>
          </button>
        </div>
      </nav>

      {/* Full Screen Menu Drawer */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60] bg-background animate-in slide-in-from-bottom-full duration-300">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-primary">More Options</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center w-full p-4 rounded-xl bg-card border border-white/5 active:bg-white/5 transition-colors"
                >
                  <span className="text-base font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
