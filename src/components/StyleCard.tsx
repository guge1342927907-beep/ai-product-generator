"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

const colorMap: Record<number, string> = {
  0: "from-[#1a1a2e] via-[#1a1a2e] to-[#16213e]",
  1: "from-[#0d1117] via-[#0d1117] to-[#161b22]",
  2: "from-[#1a1a2e] via-[#1a1a2e] to-[#2d1b69]",
  3: "from-[#0f172a] via-[#0f172a] to-[#1e293b]",
  4: "from-[#1a0a2e] via-[#1a0a2e] to-[#2d1b4e]",
  5: "from-[#0a1628] via-[#0a1628] to-[#16213e]",
  6: "from-[#1a1a2e] via-[#1a1a2e] to-[#0f3460]",
  7: "from-[#0d0d1a] via-[#0d0d1a] to-[#1a1a3e]",
  8: "from-[#0a0a1a] via-[#0a0a1a] to-[#16213e]",
};

interface StyleCardProps {
  icon: LucideIcon;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  index: number;
}

export function StyleCard({
  icon: Icon,
  label,
  description,
  selected,
  onClick,
  index,
}: StyleCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-300 text-left ${
        selected
          ? "border-purple-accent bg-purple-accent/[0.08] glow-ring"
          : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]"
      }`}
    >
      {/* Preview thumbnail */}
      <div
        className={`relative w-full aspect-[4/5] rounded-xl bg-gradient-to-br ${colorMap[index % Object.keys(colorMap).length]} overflow-hidden border border-white/[0.04]`}
      >
        {/* Decorative mock UI */}
        <div className="absolute inset-x-3 top-3 h-1.5 rounded-full bg-white/[0.06]" />
        <div className="absolute inset-x-3 top-6 h-1 rounded-full bg-white/[0.04] w-3/4" />
        <div className="absolute inset-x-3 top-9 h-1 rounded-full bg-white/[0.03] w-1/2" />
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-t from-purple-accent/20 via-transparent to-transparent"
          />
        )}
        {/* Check mark */}
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2 w-5 h-5 rounded-full bg-purple-accent flex items-center justify-center"
          >
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        )}
      </div>

      <div className="w-full">
        <div className="flex items-center gap-2">
          <Icon
            className={`w-4 h-4 ${selected ? "text-purple-accent" : "text-muted"}`}
          />
          <span
            className={`text-sm font-semibold ${selected ? "text-white" : "text-muted"}`}
          >
            {label}
          </span>
        </div>
        <p className="text-[11px] text-muted/60 mt-0.5 leading-tight">
          {description}
        </p>
      </div>
    </motion.button>
  );
}
