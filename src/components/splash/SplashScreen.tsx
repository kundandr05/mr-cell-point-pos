"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedBackground } from "./AnimatedBackground";
import { GoldParticles } from "./GoldParticles";
import { LogoAnimation } from "./LogoAnimation";

export function SplashScreen() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Show splash unconditionally
    setShowSplash(true);

    // Auto complete after 5.5 seconds
    const endTimer = setTimeout(() => {
      completeSplash();
    }, 5500);

    return () => {
      clearTimeout(endTimer);
    };
  }, [router]);

  const completeSplash = () => {
    setIsFadingOut(true);
    
    // Wait for fade out animation to finish before redirecting
    setTimeout(() => {
      router.replace("/login");
    }, 800);
  };

  if (!showSplash) return null;

  return (
    <AnimatePresence>
      {!isFadingOut && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0A] overflow-hidden"
        >
          <AnimatedBackground />
          <GoldParticles />
          <LogoAnimation />

        </motion.div>
      )}
    </AnimatePresence>
  );
}
