"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Wallet, PackageOpen, ArrowDown } from "lucide-react";

export function ReportsClient({ data }: { data: any }) {
  return (
    <div className="space-y-6 pb-10">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">30 Day Revenue</h3>
            <p className="text-4xl font-light text-foreground">₹{data.totalRevenue.toFixed(0)}</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        <div className="glass-card p-6 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">30 Day Profit</h3>
            <p className="text-4xl font-light text-success">₹{data.totalProfit.toFixed(0)}</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
            <Wallet className="w-8 h-8 text-success" />
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="glass-card p-6 rounded-2xl border border-white/5">
        <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" /> Revenue Trend (Last 30 Days)
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.salesTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4A017" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#D4A017" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#D4A017' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#D4A017" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fast & Slow Moving Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Fast Moving */}
        <div className="glass-card rounded-2xl border border-white/5 flex flex-col overflow-hidden">
          <div className="p-5 bg-black/20 border-b border-white/5 flex items-center gap-2">
            <PackageOpen className="w-5 h-5 text-success" />
            <h3 className="text-lg font-semibold">Fast Moving Products</h3>
          </div>
          <div className="p-0 overflow-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-black/40 text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3 text-center">Sold</th>
                  <th className="px-5 py-3 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.fastMoving.map((item: any, i: number) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-3">
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">SKU: {item.sku} | Stock: {item.stock}</p>
                    </td>
                    <td className="px-5 py-3 text-center font-bold text-success">{item.sold}</td>
                    <td className="px-5 py-3 text-right font-medium text-primary">₹{item.revenue.toFixed(0)}</td>
                  </tr>
                ))}
                {data.fastMoving.length === 0 && (
                  <tr><td colSpan={3} className="text-center py-6 text-muted-foreground">No data available</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Slow Moving */}
        <div className="glass-card rounded-2xl border border-white/5 flex flex-col overflow-hidden">
          <div className="p-5 bg-black/20 border-b border-white/5 flex items-center gap-2">
            <ArrowDown className="w-5 h-5 text-destructive" />
            <h3 className="text-lg font-semibold">Slow Moving Products</h3>
          </div>
          <div className="p-0 overflow-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-black/40 text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3 text-center">Sold</th>
                  <th className="px-5 py-3 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.slowMoving.map((item: any, i: number) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-3">
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">SKU: {item.sku} | Stock: {item.stock}</p>
                    </td>
                    <td className="px-5 py-3 text-center font-bold text-destructive">{item.sold}</td>
                    <td className="px-5 py-3 text-right font-medium text-primary">₹{item.revenue.toFixed(0)}</td>
                  </tr>
                ))}
                {data.slowMoving.length === 0 && (
                  <tr><td colSpan={3} className="text-center py-6 text-muted-foreground">No data available</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
