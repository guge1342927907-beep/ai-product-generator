"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Coins, Search, Calendar } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { GlowOrb } from "@/components/GlowOrb";
import { Sidebar } from "@/components/Sidebar";
import { ScrollToTop } from "@/components/ScrollToTop";

export default function PointsPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <div className="relative min-h-screen overflow-hidden">
      <GlowOrb color="rgba(6, 182, 212, 0.08)" className="top-0 left-1/4" size={450} />
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
              className="mb-8"
            >
              <div className="flex items-center gap-4 mb-4">
                <Link href="/" className="flex items-center gap-1.5 text-sm text-muted hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  返回首页
                </Link>
                <div className="w-px h-4 bg-white/[0.08]" />
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyber-blue to-blue-500 flex items-center justify-center shadow-md shadow-cyber-blue/25">
                    <Coins className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h1 className="text-xl font-semibold tracking-tight text-white">积分流水</h1>
                </div>
              </div>
            </motion.div>

            {/* ─── Balance card ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
              className="rounded-2xl border border-cyber-blue/15 bg-gradient-to-br from-cyber-blue/[0.06] to-purple-accent/[0.04] backdrop-blur-xl p-6 mb-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyber-blue/15 flex items-center justify-center">
                  <Coins className="w-6 h-6 text-cyber-blue" />
                </div>
                <div>
                  <p className="text-xs text-muted/60 mb-0.5">积分余额</p>
                  <p className="text-3xl font-bold text-cyber-blue">0</p>
                  <p className="text-[11px] text-muted/40 mt-0.5">显示总余额（付费 + 赠送）</p>
                </div>
              </div>
            </motion.div>

            {/* ─── Date filter ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="flex items-center gap-3 mb-6 p-4 rounded-2xl border border-white/[0.08] bg-white/[0.02]"
            >
              <Calendar className="w-4 h-4 text-muted/50 shrink-0" />
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 text-sm text-white bg-white/[0.03] border border-white/[0.08] rounded-lg focus:outline-none focus:border-purple-accent/40 transition-all duration-200 [color-scheme:dark]"
                />
                <span className="text-xs text-muted/40">至</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 text-sm text-white bg-white/[0.03] border border-white/[0.08] rounded-lg focus:outline-none focus:border-purple-accent/40 transition-all duration-200 [color-scheme:dark]"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-purple-accent to-cyber-blue shadow-lg shadow-purple-accent/20"
              >
                <Search className="w-3.5 h-3.5" />
                查询
              </motion.button>
            </motion.div>

            {/* ─── Empty state ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl overflow-hidden"
            >
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-3">
                  <Coins className="w-6 h-6 text-muted/20" />
                </div>
                <p className="text-sm text-muted/50 font-medium">暂无流水记录</p>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
      <ScrollToTop />
    </div>
  );
}
