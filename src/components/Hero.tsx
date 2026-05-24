"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-md mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-accent" />
          </span>
          <span className="text-xs font-medium text-muted tracking-wide">
            AI 驱动 · 电商专用 · 极速出图
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08]"
        >
          专业 AI 电商
          <br />
          <span className="text-gradient">图片视频生成平台</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
          className="mt-6 mx-auto max-w-lg text-base sm:text-lg text-muted leading-relaxed"
        >
          上传图片并选择风格，让 AI 为您生成专业主图
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/generate"
            className="group relative inline-flex items-center gap-2.5 px-8 py-4 text-base font-semibold text-white rounded-2xl bg-gradient-to-r from-purple-accent via-cyber-blue to-purple-accent bg-[length:200%_100%] hover:bg-right transition-all duration-500 shadow-xl shadow-purple-accent/25 hover:shadow-purple-accent/40 hover:scale-[1.02]"
          >
            <Sparkles className="w-5 h-5" />
            创建您的作品
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>

          <a
            href="#tutorial"
            className="inline-flex items-center gap-2 px-8 py-4 text-sm font-medium text-muted hover:text-white rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.05] hover:border-white/[0.14] transition-all duration-300"
          >
            <Play className="w-4 h-4" />
            使用教程
          </a>
        </motion.div>

        {/* Trust stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
          className="mt-16 flex items-center justify-center gap-8 sm:gap-12"
        >
          {[
            { value: "50 万+", label: "图片已生成" },
            { value: "3 万+", label: "活跃商家" },
            { value: "30 秒", label: "平均出图速度" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-gradient-static">
                {value}
              </div>
              <div className="text-xs text-muted mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
