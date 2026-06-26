import React from "react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "sidebar" | "lg" | "xl" | "splash";
  withText?: boolean;
}

export function BrandLogo({ className, size = "sidebar", withText = false }: BrandLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    sidebar: "w-[44px] h-[44px]",
    lg: "w-16 h-16 md:w-20 md:h-20", 
    xl: "w-[90px] h-[90px] md:w-[110px] md:h-[110px]", 
    splash: "w-[170px] h-[170px] md:w-[190px] md:h-[190px]",
  };

  return (
    <div className={cn("flex items-center gap-3 group", className)}>
      <div
        className={cn(
          "flex items-center justify-center relative shrink-0",
          "bg-black rounded-full border border-[#D4AF37]/50 overflow-hidden",
          "shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all duration-300",
          "group-hover:shadow-[0_0_25px_rgba(212,175,55,0.8)] group-hover:border-[#D4AF37]",
          sizeClasses[size]
        )}
      >
        <img src="/logo.png" alt="MR Cell Point Logo" className="w-full h-full object-cover rounded-full" />
      </div>
      {withText && (
        <span className="font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">
          M R Cell Point
        </span>
      )}
    </div>
  );
}
