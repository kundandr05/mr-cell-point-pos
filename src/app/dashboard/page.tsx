import { TrendingUp, CreditCard, Wallet, PackageOpen, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-light tracking-tight text-foreground/90">Dashboard Overview</h2>
      </div>
      
      <div className="bento-grid">
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Today&apos;s Sales</h3>
            <div className="p-2 bg-success/10 rounded-full"><TrendingUp className="h-4 w-4 text-success" /></div>
          </div>
          <p className="text-4xl font-light text-foreground">₹0</p>
        </div>
        
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Monthly Sales</h3>
            <div className="p-2 bg-primary/10 rounded-full"><CreditCard className="h-4 w-4 text-primary" /></div>
          </div>
          <p className="text-4xl font-light text-primary">₹0</p>
        </div>
        
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Yearly Sales</h3>
            <div className="p-2 bg-primary/10 rounded-full"><Wallet className="h-4 w-4 text-primary" /></div>
          </div>
          <p className="text-4xl font-light text-primary">₹0</p>
        </div>
        
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Inventory Value</h3>
            <div className="p-2 bg-warning/10 rounded-full"><PackageOpen className="h-4 w-4 text-warning" /></div>
          </div>
          <p className="text-4xl font-light text-warning">₹0</p>
        </div>
        
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Pending Payments</h3>
            <div className="p-2 bg-destructive/10 rounded-full"><AlertCircle className="h-4 w-4 text-destructive" /></div>
          </div>
          <p className="text-4xl font-light text-destructive">₹0</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="glass-card p-6 rounded-2xl min-h-[300px] flex flex-col">
          <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" /> Low Stock Alerts
          </h3>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-white/5 rounded-xl bg-white/[0.02]">
            <p className="text-muted-foreground text-sm font-medium">Inventory looks healthy</p>
          </div>
        </div>
        
        <div className="glass-card p-6 rounded-2xl min-h-[300px] flex flex-col">
          <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" /> Top Selling Products
          </h3>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-white/5 rounded-xl bg-white/[0.02]">
            <p className="text-muted-foreground text-sm font-medium">No sales data yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}
