"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Flame } from "lucide-react";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteModal({ isOpen, onClose }: InviteModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative w-full max-w-sm rounded-2xl border border-white/[0.1] bg-[#0c0824]/90 backdrop-blur-xl shadow-2xl shadow-purple-accent/10"
          >
            {/* Ambient glow behind modal */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-purple-accent/10 via-cyber-blue/5 to-purple-accent/5 blur-xl -z-10" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-muted hover:text-white hover:bg-white/[0.06] transition-all duration-200 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="flex flex-col items-center px-8 py-10">
              {/* Flame/Gift icon */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.05, duration: 0.4, ease: "easeOut" }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-accent via-[#a855f7] to-[#ec4899] flex items-center justify-center shadow-xl shadow-purple-accent/30 mb-5"
              >
                <Flame className="w-8 h-8 text-white" />
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.35 }}
                className="text-lg font-bold text-white tracking-tight mb-1.5"
              >
                拉新充值阶梯返利
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.35 }}
                className="text-sm text-muted/70 mb-8"
              >
                邀友充值，共享最高 50% 巨额积分返利
              </motion.p>

              {/* Empty state */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.35 }}
                className="w-full py-8 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-center mb-8"
              >
                <span className="text-sm text-muted/50">
                  当前暂无进行中的活动
                </span>
              </motion.div>

              {/* Bottom hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.35 }}
                className="text-xs text-muted/40"
              >
                登录后开始邀请
              </motion.p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
