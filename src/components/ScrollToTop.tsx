"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.08] border border-white/[0.12] backdrop-blur-xl text-muted hover:text-white hover:bg-white/[0.14] hover:border-purple-accent/40 hover:shadow-[0_0_24px_rgba(139,92,246,0.2)] transition-all duration-300 group"
        >
          <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-200" />
          <span className="text-sm font-medium whitespace-nowrap">回到顶部</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
