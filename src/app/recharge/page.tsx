"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ReceiptText, RefreshCw, Coins } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { GlowOrb } from "@/components/GlowOrb";
import { Sidebar } from "@/components/Sidebar";
import { ScrollToTop } from "@/components/ScrollToTop";

export default function RechargePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <GlowOrb color="rgba(16, 185, 129, 0.08)" className="top-0 left-1/4" size={450} />
      <GlowOrb color="rgba(139, 92, 246, 0.06)" className="top-1/3 -right-16" size={380} />

      <div className="fixed inset-0 bg-grid pointer-events-none" />

      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 pt-24 pb-16 px-6 lg:px-8 min-w-0">
          <div className="mx-auto max-w-4xl">
            {/* ─── Header ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex items-start justify-between mb-8"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <Link href="/" className="flex items-center gap-1.5 text-sm text-muted hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    返回首页
                  </Link>
                  <div className="w-px h-4 bg-white/[0.08]" />
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-md shadow-emerald-500/25">
                      <ReceiptText className="w-3.5 h-3.5 text-white" />
                    </div>
                    <h1 className="text-xl font-semibold tracking-tight text-white">充值记录</h1>
                  </div>
                </div>
                <p className="text-sm text-muted ml-[132px]">
                  查看充值订单，待支付的订单可以继续完成支付
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95, rotate: -30 }}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted hover:text-white rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.14] transition-all duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                刷新
              </motion.button>
            </motion.div>

            {/* ─── Empty state ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl overflow-hidden"
            >
              <div className="flex flex-col items-center justify-center py-20">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-400/15 flex items-center justify-center mb-5"
                >
                  <Coins className="w-10 h-10 text-emerald-400/40" />
                </motion.div>
                <p className="text-base font-semibold text-white mb-1.5">暂无充值记录</p>
                <p className="text-sm text-muted/40">暂无充值订单</p>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
      <ScrollToTop />
    </div>
  );
}
