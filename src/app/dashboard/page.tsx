export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
      
      <div className="bento-grid">
        <div className="glass-card p-6 rounded-xl space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground uppercase">Today's Sales</h3>
          <p className="text-3xl font-bold text-success">₹0</p>
        </div>
        <div className="glass-card p-6 rounded-xl space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground uppercase">Monthly Sales</h3>
          <p className="text-3xl font-bold text-primary">₹0</p>
        </div>
        <div className="glass-card p-6 rounded-xl space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground uppercase">Yearly Sales</h3>
          <p className="text-3xl font-bold text-primary">₹0</p>
        </div>
        <div className="glass-card p-6 rounded-xl space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground uppercase">Inventory Value</h3>
          <p className="text-3xl font-bold text-warning">₹0</p>
        </div>
        <div className="glass-card p-6 rounded-xl space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground uppercase">Pending Payments</h3>
          <p className="text-3xl font-bold text-destructive">₹0</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="glass-card p-6 rounded-xl min-h-[300px]">
          <h3 className="text-lg font-medium mb-4">Low Stock Alerts</h3>
          <p className="text-muted-foreground text-sm">No items are currently running low on stock.</p>
        </div>
        
        <div className="glass-card p-6 rounded-xl min-h-[300px]">
          <h3 className="text-lg font-medium mb-4">Top Selling Products</h3>
          <p className="text-muted-foreground text-sm">Not enough data to display top selling products.</p>
        </div>
      </div>
    </div>
  );
}
