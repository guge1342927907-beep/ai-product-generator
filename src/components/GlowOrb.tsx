"use client";

import { motion } from "framer-motion";

interface GlowOrbProps {
  color: string;
  className?: string;
  size?: number;
  opacity?: number;
}

export function GlowOrb({ color, className = "", size = 600, opacity = 0.15 }: GlowOrbProps) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.15, 1],
        opacity: [opacity, opacity * 1.4, opacity],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`absolute rounded-full blur-[120px] pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color}, transparent 70%)`,
      }}
    />
  );
}
