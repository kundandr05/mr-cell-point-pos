import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  withText?: boolean;
}

export function Logo({ className, size = "md", withText = false }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-auto max-h-8",
    md: "w-12 h-auto max-h-12",
    lg: "w-20 h-auto max-h-20",
    xl: "w-[180px] h-auto md:w-[220px] max-h-[180px] md:max-h-[220px]",
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex items-center justify-center relative",
          sizeClasses[size]
        )}
      >
        <img src="/logo.jpg" alt="MR Cell Point Logo" className="w-full h-full object-contain" />
      </div>
      {withText && (
        <span className="font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">
          M R Cell Point
        </span>
      )}
    </div>
  );
}
