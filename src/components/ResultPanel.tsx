"use client";

import { motion } from "framer-motion";
import { Download, Maximize2, Sparkles, Image } from "lucide-react";

interface ResultPanelProps {
  isLoading: boolean;
  generatedCount: number;
}

export function ResultPanel({ isLoading, generatedCount }: ResultPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col h-full"
    >
      {/* Preview container */}
      <div className="relative flex-1 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md overflow-hidden min-h-[480px]">
        {isLoading ? (
          /* Skeleton loading state */
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f0a2e] via-[#0c0824] to-[#0a1628]">
            {/* 9-image grid skeleton */}
            <div className="grid grid-cols-3 gap-2 p-4 h-full">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="relative rounded-xl bg-white/[0.03] border border-white/[0.04] overflow-hidden"
                >
                  <div className="absolute inset-0 skeleton-shimmer" />
                </div>
              ))}
            </div>

            {/* Processing badge */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/[0.08]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-accent" />
              </motion.div>
              <span className="text-xs font-medium text-muted">AI 生成中...</span>
            </div>
          </div>
        ) : generatedCount > 0 ? (
          /* Generated results — 9-image grid */
          <div className="grid grid-cols-3 gap-2 p-4 h-full">
            {Array.from({ length: 9 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06, duration: 0.3, ease: "easeOut" }}
                className={`relative rounded-xl overflow-hidden border ${
                  i === 0
                    ? "border-purple-accent/40 glow-ring col-span-2 row-span-2"
                    : "border-white/[0.06] hover:border-white/[0.14]"
                } bg-gradient-to-br from-[#0f0a2e] via-[#0c0824] to-[#0a1628] transition-all duration-300 cursor-pointer group`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image className="w-6 h-6 text-muted/30 group-hover:text-purple-accent/40 transition-colors" />
                </div>
                {i === 0 && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-purple-accent/80 text-[10px] font-semibold text-white">
                    主图
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.04] flex items-center justify-center">
              <Image className="w-7 h-7 text-muted/40" />
            </div>
            <div className="text-center">
              <p className="text-sm text-muted font-medium mb-1">暂无生成结果</p>
              <p className="text-xs text-muted/50">
                上传图片并选择风格后开始生成
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-4">
        <button
          disabled={isLoading || generatedCount === 0}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-purple-accent to-cyber-blue hover:opacity-90 transition-all duration-300 shadow-lg shadow-purple-accent/20 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.02]"
        >
          <Download className="w-4 h-4" />
          下载全部 (HD)
        </button>
        <button
          disabled={isLoading || generatedCount === 0}
          className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-muted hover:text-white rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.14] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.02]"
        >
          <Maximize2 className="w-4 h-4" />
          放大 4K
        </button>
      </div>
    </motion.div>
  );
}
