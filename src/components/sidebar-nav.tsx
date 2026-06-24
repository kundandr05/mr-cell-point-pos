"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Receipt, FileText, Package, ShoppingCart, Tags, Bookmark, Users, BarChart3, Settings } from "lucide-react";

export function SidebarNav() {
  const pathname = usePathname();

  const salesLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "New Bill", href: "/dashboard/billing", icon: Receipt },
    { name: "Invoices", href: "/dashboard/invoices", icon: FileText },
  ];

  const inventoryLinks = [
    { name: "Products", href: "/dashboard/products", icon: Package },
    { name: "Purchases", href: "/dashboard/purchases", icon: ShoppingCart },
    { name: "Categories", href: "/dashboard/categories", icon: Tags },
    { name: "Brands", href: "/dashboard/brands", icon: Bookmark },
  ];

  const managementLinks = [
    { name: "Suppliers", href: "/dashboard/suppliers", icon: Users },
    { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
    { name: "Shop Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const renderLinks = (links: typeof salesLinks) => {
    return links.map((link) => {
      const isActive = pathname === link.href;
      return (
        <Link
          key={link.name}
          href={link.href}
          className={`flex items-center gap-3 px-4 py-1.5 text-sm font-medium transition-all duration-200 rounded-r-full ${
            isActive
              ? "bg-primary/10 border-l-2 border-primary text-primary"
              : "border-l-2 border-transparent text-muted-foreground hover:bg-white/5 hover:text-foreground"
          }`}
        >
          <link.icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
          {link.name}
        </Link>
      );
    });
  };

  return (
    <nav className="flex-1 overflow-y-auto py-4 pr-4 space-y-4">
      <div className="space-y-0.5">
        <p className="px-6 mb-1 text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest">
          Sales & Billing
        </p>
        {renderLinks(salesLinks)}
      </div>

      <div className="space-y-0.5">
        <p className="px-6 mb-1 text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest">
          Inventory
        </p>
        {renderLinks(inventoryLinks)}
      </div>

      <div className="space-y-0.5">
        <p className="px-6 mb-1 text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest">
          Management
        </p>
        {renderLinks(managementLinks)}
      </div>
    </nav>
  );
}
