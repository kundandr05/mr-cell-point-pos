"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateShopSettings } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Save, Store, Mail, Phone, MapPin, FileText } from "lucide-react";

export function SettingsClient({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    gstin: initialData?.gstin || "",
    address: initialData?.address || "",
    phoneNumber: initialData?.phoneNumber || "",
    email: initialData?.email || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    
    const result = await updateShopSettings(formData);
    
    if (result.success) {
      toast.success("Settings updated successfully!");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update settings");
    }
    
    setIsPending(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card glass-card p-6 rounded-2xl border border-white/5 space-y-6">
      
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
          <Store className="w-4 h-4" /> Shop Name
        </label>
        <Input 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          placeholder="MR Cell Point" 
          required 
          className="bg-black/20 border-white/10 h-12"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
            <FileText className="w-4 h-4" /> GST Number
          </label>
          <Input 
            name="gstin" 
            value={formData.gstin} 
            onChange={handleChange} 
            placeholder="29AUZPM3464D1Z1" 
            required 
            className="bg-black/20 border-white/10 h-12"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
            <Phone className="w-4 h-4" /> Phone Number
          </label>
          <Input 
            name="phoneNumber" 
            value={formData.phoneNumber} 
            onChange={handleChange} 
            placeholder="+91 9999999999" 
            required 
            className="bg-black/20 border-white/10 h-12"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
          <Mail className="w-4 h-4" /> Email Address
        </label>
        <Input 
          type="email"
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          placeholder="contact@mrcellpoint.in" 
          required 
          className="bg-black/20 border-white/10 h-12"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4" /> Full Address
        </label>
        <Input 
          name="address" 
          value={formData.address} 
          onChange={handleChange} 
          placeholder="C.N. Road, Bhadravathi - 577301" 
          required 
          className="bg-black/20 border-white/10 h-12"
        />
      </div>

      <div className="pt-4 border-t border-white/10 flex justify-end">
        <Button 
          type="submit" 
          disabled={isPending}
          className="bg-primary text-primary-foreground px-8 shadow-[0_0_20px_rgba(212,160,23,0.3)] hover:shadow-[0_0_30px_rgba(212,160,23,0.5)] transition-all h-12 rounded-xl"
        >
          <Save className="w-4 h-4 mr-2" />
          {isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>

    </form>
  );
}
