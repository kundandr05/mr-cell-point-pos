"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Receipt, 
  FileText, 
  Package, 
  ShoppingCart, 
  Tags, 
  Bookmark, 
  Users, 
  BarChart3, 
  Settings,
  ChevronDown,
  RotateCcw,
  UserCircle,
  DatabaseBackup,
  PieChart,
  FileSpreadsheet
} from "lucide-react";

type NavLink = {
  name: string;
  href: string;
  icon: React.ElementType;
};

type NavSection = {
  title: string;
  links: NavLink[];
};

const navStructure: NavSection[] = [
  {
    title: "Billing",
    links: [
      { name: "New Bill", href: "/dashboard/billing", icon: Receipt },
      { name: "Invoices", href: "/dashboard/invoices", icon: FileText },
      { name: "Returns", href: "/dashboard/returns", icon: RotateCcw },
    ]
  },
  {
    title: "Inventory",
    links: [
      { name: "Products", href: "/dashboard/products", icon: Package },
      { name: "Categories", href: "/dashboard/categories", icon: Tags },
      { name: "Brands", href: "/dashboard/brands", icon: Bookmark },
      { name: "Purchases", href: "/dashboard/purchases", icon: ShoppingCart },
      { name: "Suppliers", href: "/dashboard/suppliers", icon: Users },
    ]
  },
  {
    title: "Reports",
    links: [
      { name: "Sales Reports", href: "/dashboard/reports", icon: BarChart3 },
      { name: "Inventory Reports", href: "/dashboard/reports/inventory", icon: PieChart },
      { name: "GST Reports", href: "/dashboard/reports/gst", icon: FileSpreadsheet },
    ]
  },
  {
    title: "Management",
    links: [
      { name: "Shop Settings", href: "/dashboard/settings", icon: Settings },
      { name: "Profile", href: "/dashboard/profile", icon: UserCircle },
      { name: "Backup & Restore", href: "/dashboard/backup", icon: DatabaseBackup },
    ]
  }
];

export function SidebarNav() {
  const pathname = usePathname();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Automatically expand the section containing the active link
  useEffect(() => {
    if (pathname === "/dashboard") {
      setExpandedSection(null);
      return;
    }
    const activeSection = navStructure.find(section => 
      section.links.some(link => pathname.startsWith(link.href))
    );
    if (activeSection) {
      setExpandedSection(activeSection.title);
    }
  }, [pathname]);

  const toggleSection = (title: string) => {
    setExpandedSection(prev => prev === title ? null : title);
  };

  const isDashboardActive = pathname === "/dashboard";

  return (
    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
      {/* Dashboard Single Link */}
      <div className="mb-2">
        <Link
          href="/dashboard"
          className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 group ${
            isDashboardActive
              ? "bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(212,160,23,0.15)] text-primary"
              : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard className={`h-5 w-5 ${isDashboardActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
            <span className="text-sm font-medium">Dashboard</span>
          </div>
        </Link>
      </div>

      {/* Accordion Sections */}
      {navStructure.map((section) => {
        const isExpanded = expandedSection === section.title;
        const hasActiveLink = section.links.some(link => pathname === link.href);

        return (
          <div key={section.title} className="mb-1">
            <button
              onClick={() => toggleSection(section.title)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 group ${
                isExpanded || hasActiveLink
                  ? "text-primary font-medium"
                  : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="text-sm tracking-wide uppercase">{section.title}</span>
              <ChevronDown 
                className={`h-4 w-4 transition-transform duration-300 ${
                  isExpanded ? "rotate-180 text-primary" : "text-muted-foreground group-hover:text-foreground"
                }`} 
              />
            </button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pl-4 pr-2 py-2 space-y-1 border-l-2 border-white/5 ml-4 mt-1 mb-2">
                    {section.links.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.name}
                          href={link.href}
                          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                            isActive
                              ? "bg-primary/10 text-primary shadow-[0_0_10px_rgba(212,160,23,0.1)]"
                              : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                          }`}
                        >
                          <link.icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                          {link.name}
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </nav>
  );
}
