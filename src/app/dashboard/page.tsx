import { TrendingUp, CreditCard, Wallet, PackageOpen, AlertCircle, BarChart3, Activity, ArrowRight, PackageX, ListMinus, History } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-light tracking-tight text-foreground/90">Dashboard Overview</h2>
      </div>
      
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[minmax(140px,auto)]">
        
        {/* Large Revenue Card - Spans 2 Cols, 2 Rows */}
        <div className="glass-card p-6 rounded-2xl md:col-span-2 md:row-span-2 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform duration-500 group-hover:scale-110">
            <BarChart3 className="w-32 h-32 text-primary" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-2">Total Monthly Revenue</h3>
            <p className="text-6xl font-light text-primary">₹0</p>
            <div className="flex items-center gap-2 mt-4 text-sm font-medium">
              <span className="text-success flex items-center gap-1"><TrendingUp className="h-4 w-4"/> +0%</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </div>
          <div className="relative z-10 flex gap-4 mt-8">
            <Link href="/dashboard/billing" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-center py-3 rounded-xl font-medium transition-colors shadow-[0_0_15px_rgba(212,160,23,0.3)]">
              New Bill
            </Link>
            <Link href="/dashboard/reports" className="flex-1 bg-white/5 hover:bg-white/10 text-foreground text-center py-3 rounded-xl font-medium transition-colors border border-white/10">
              View Report
            </Link>
          </div>
        </div>
        
        {/* Today's Sales */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-center space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Today&apos;s Sales</h3>
            <div className="p-2 bg-success/10 rounded-full"><TrendingUp className="h-4 w-4 text-success" /></div>
          </div>
          <p className="text-3xl font-light text-foreground">₹0</p>
        </div>
        
        {/* Monthly Profit */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-center space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Monthly Profit</h3>
            <div className="p-2 bg-primary/10 rounded-full"><Wallet className="h-4 w-4 text-primary" /></div>
          </div>
          <p className="text-3xl font-light text-primary">₹0</p>
        </div>
        
        {/* Inventory Value */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-center space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Inventory Value</h3>
            <div className="p-2 bg-warning/10 rounded-full"><PackageOpen className="h-4 w-4 text-warning" /></div>
          </div>
          <p className="text-3xl font-light text-warning">₹0</p>
        </div>
        
        {/* Pending Payments */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-center space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Pending Payments</h3>
            <div className="p-2 bg-destructive/10 rounded-full"><AlertCircle className="h-4 w-4 text-destructive" /></div>
          </div>
          <p className="text-3xl font-light text-destructive">₹0</p>
        </div>

        {/* Low Stock Alerts - Spans 2 Cols */}
        <div className="glass-card p-6 rounded-2xl md:col-span-2 min-h-[250px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" /> Low Stock Alerts
            </h3>
            <Link href="/dashboard/products" className="text-xs text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-black/20">
            <EmptyState 
              icon={PackageX} 
              title="Inventory is Healthy" 
              description="No items are currently running low on stock." 
            />
          </div>
        </div>
        
        {/* Top Selling Products */}
        <div className="glass-card p-6 rounded-2xl min-h-[250px] flex flex-col">
          <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" /> Top Products
          </h3>
          <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-black/20">
            <EmptyState 
              icon={ListMinus} 
              title="No Sales Data" 
              description="Generate a bill to start tracking your top products." 
            />
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="glass-card p-6 rounded-2xl min-h-[250px] flex flex-col">
          <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
            <Activity className="h-5 w-5 text-muted-foreground" /> Recent Activity
          </h3>
          <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-black/20">
            <EmptyState 
              icon={History} 
              title="No Recent Activity" 
              description="Your shop's recent activity will appear here." 
            />
          </div>
        </div>
        
      </div>
    </div>
  );
}
