import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  withText?: boolean;
}

export function Logo({ className, size = "md", withText = false }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10 md:w-12 md:h-12", // 40-48px for Sidebar
    lg: "w-16 h-16 md:w-20 md:h-20", 
    xl: "w-[90px] h-[90px] md:w-[110px] md:h-[110px]", // 90-110px for Login Page
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex items-center justify-center relative shrink-0",
          "bg-black rounded-full border border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.4)] overflow-hidden",
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
