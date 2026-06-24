import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  withText?: boolean;
}

export function Logo({ className, size = "md", withText = false }: LogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6 text-sm",
    md: "w-8 h-8 text-base",
    lg: "w-12 h-12 text-2xl",
    xl: "w-16 h-16 text-3xl",
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(212,160,23,0.15)]",
          sizeClasses[size]
        )}
      >
        <span className="font-black text-transparent bg-clip-text bg-gradient-to-br from-[#D4A017] to-[#F3E5AB]">
          M
        </span>
      </div>
      {withText && (
        <span className="font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">
          M R Cell Point
        </span>
      )}
    </div>
  );
}
