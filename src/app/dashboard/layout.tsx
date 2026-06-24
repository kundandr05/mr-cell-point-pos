import { ReactNode } from "react";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen w-full bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card glass-card flex flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <span className="font-bold text-lg text-primary">M R Cell Point</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <Link href="/dashboard" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground">
            Dashboard
          </Link>
          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Sales & Billing
            </p>
          </div>
          <Link href="/dashboard/billing" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground">
            New Bill
          </Link>
          <Link href="/dashboard/invoices" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground">
            Invoices
          </Link>
          
          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Inventory
            </p>
          </div>
          <Link href="/dashboard/products" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground">
            Products
          </Link>
          <Link href="/dashboard/purchases" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground">
            Purchases
          </Link>
          <Link href="/dashboard/categories" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground">
            Categories
          </Link>
          <Link href="/dashboard/brands" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground">
            Brands
          </Link>
          
          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Management
            </p>
          </div>
          <Link href="/dashboard/suppliers" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground">
            Suppliers
          </Link>
          <Link href="/dashboard/reports" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground">
            Reports
          </Link>
          <Link href="/dashboard/settings" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground">
            Shop Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex flex-col">
              <span className="text-sm font-medium">{session.user?.name}</span>
              <span className="text-xs text-muted-foreground capitalize">{session.user?.role?.toLowerCase()}</span>
            </div>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button variant="outline" className="w-full justify-start" type="submit">
              Log out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b bg-card glass-card flex items-center px-6 justify-between shrink-0">
          <h1 className="text-xl font-semibold">Inventory & Billing System</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
