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
  const [showSkip, setShowSkip] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Check if splash has been seen in this session
    const hasSeenSplash = sessionStorage.getItem("mr_splash_seen");
    
    if (hasSeenSplash === "true") {
      // Immediately skip
      router.replace("/login");
      return;
    }

    // Show splash
    setShowSplash(true);

    // Show skip button after 2 seconds
    const skipTimer = setTimeout(() => {
      setShowSkip(true);
    }, 2000);

    // Auto complete after 5.5 seconds
    const endTimer = setTimeout(() => {
      completeSplash();
    }, 5500);

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(endTimer);
    };
  }, [router]);

  const completeSplash = () => {
    setIsFadingOut(true);
    sessionStorage.setItem("mr_splash_seen", "true");
    
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

          {/* Skip Button */}
          <AnimatePresence>
            {showSkip && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                onClick={completeSplash}
                className="absolute bottom-10 right-10 text-white/50 hover:text-white/90 text-sm tracking-widest uppercase transition-colors z-50"
              >
                Skip &rarr;
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
