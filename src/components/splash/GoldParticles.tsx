"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function GoldParticles() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

  useEffect(() => {
    // Generate particles only on the client to avoid hydration mismatch
    const generated = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            opacity: 0,
            x: `${particle.x}vw`,
            y: `${particle.y}vh`,
          }}
          animate={{
            opacity: [0, 0.5, 0],
            y: [`${particle.y}vh`, `${particle.y - 20}vh`],
          }}
          transition={{
            duration: Math.random() * 3 + 3,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 2,
          }}
          className="absolute rounded-full bg-[#D4AF37]"
          style={{
            width: particle.size,
            height: particle.size,
            boxShadow: `0 0 ${particle.size * 2}px #D4AF37`,
          }}
        />
      ))}
    </div>
  );
}
