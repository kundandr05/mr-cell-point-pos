import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface BrandLogoProps {
  className?: string;
  size?: "small" | "medium" | "large" | "xl" | "splash";
  showText?: boolean;
  animated?: boolean;
  glow?: boolean;
}

export function BrandLogo({ 
  className, 
  size = "small", 
  showText = false,
  animated = false,
  glow = true
}: BrandLogoProps) {
  const sizeClasses = {
    small: "w-[44px] h-[44px]", // Sidebar
    medium: "w-[48px] h-[48px]", // Header
    large: "w-[70px] h-[70px]", // Invoice / PDF
    xl: "w-[100px] h-[100px]", // Login
    splash: "w-[180px] h-[180px]", // Splash Screen
  };

  const imageSizes = {
    small: 44,
    medium: 48,
    large: 70,
    xl: 100,
    splash: 180,
  };

  const currentSize = imageSizes[size];

  return (
    <div className={cn("flex items-center gap-3 group", className)}>
      <div
        className={cn(
          "flex items-center justify-center relative shrink-0",
          "bg-black rounded-full border border-[#D4AF37] overflow-hidden",
          glow && "shadow-[0_0_15px_rgba(212,175,55,0.4)]",
          glow && animated && "transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(212,175,55,0.8)]",
          sizeClasses[size]
        )}
      >
        <Image 
          src="/logo.png" 
          alt="MR Cell Point Logo" 
          width={currentSize}
          height={currentSize}
          className="w-full h-full object-cover rounded-full" 
          priority
          quality={100}
        />
      </div>
      {showText && (
        <span className="font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">
          M R Cell Point
        </span>
      )}
    </div>
  );
}
