"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function LogoAnimation() {
  return (
    <div className="relative flex flex-col items-center justify-center z-10">
      
      {/* Rotating Gold Ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        className="absolute w-[240px] h-[240px] rounded-full border-[3px] border-t-[#D4AF37] border-r-[#FFD54F] border-b-transparent border-l-transparent opacity-80"
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute w-[260px] h-[260px] rounded-full border-[1px] border-dashed border-[#D4AF37]/40"
      />

      {/* Main Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
        className="relative w-[180px] h-[180px] rounded-full overflow-hidden flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <Image
          src="/logo.png"
          alt="MR Cell Point"
          fill
          className="object-cover"
          priority
        />
        
        {/* Shine Effect */}
        <motion.div
          initial={{ x: "-100%", skewX: -20 }}
          animate={{ x: "200%" }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 1.5 }}
          className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent z-20 pointer-events-none"
        />
      </motion.div>

      {/* Text Elements */}
      <div className="mt-12 flex flex-col items-center text-center space-y-2">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-4xl md:text-5xl font-black text-white tracking-tight"
        >
          MR Cell Point
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="text-[#D4AF37] font-semibold tracking-[0.2em] uppercase text-sm md:text-base"
        >
          Mobile Accessories
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.0 }}
          className="text-white/40 text-xs md:text-sm tracking-widest uppercase"
        >
          Bhadravathi
        </motion.p>
      </div>

      {/* Final Slogan */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3.5 }}
        className="absolute bottom-[-80px] w-full text-center"
      >
        <p className="text-white/80 font-medium tracking-wider text-sm md:text-base bg-gradient-to-r from-[#D4AF37] to-[#FFD54F] bg-clip-text text-transparent">
          Smart Billing. Smart Inventory.
        </p>
      </motion.div>
    </div>
  );
}
