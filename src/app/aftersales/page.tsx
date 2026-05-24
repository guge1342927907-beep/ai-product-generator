"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Headset,
  ShieldCheck,
  AlertCircle,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { GlowOrb } from "@/components/GlowOrb";
import { Sidebar } from "@/components/Sidebar";
import { ScrollToTop } from "@/components/ScrollToTop";

export default function AftersalesPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <GlowOrb color="rgba(139, 92, 246, 0.10)" className="top-0 left-1/4" size={500} />
      <GlowOrb color="rgba(6, 182, 212, 0.05)" className="top-1/3 -right-16" size={380} />

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
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-accent to-cyber-blue flex items-center justify-center shadow-md shadow-purple-accent/25">
                    <Headset className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h1 className="text-xl font-semibold tracking-tight text-white">售后记录</h1>
                </div>
              </div>
              <p className="text-sm text-muted ml-[132px]">查看您的申诉与退款历史</p>
            </motion.div>

            {/* ─── AI Review card ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
              className="rounded-2xl border border-purple-accent/15 bg-gradient-to-b from-purple-accent/[0.04] to-transparent backdrop-blur-xl p-5 mb-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-accent/15 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-purple-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm font-semibold text-white">AI 智能审核说明</p>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-accent/15 text-purple-accent border border-purple-accent/25">
                      自动审核
                    </span>
                  </div>
                  <div className="space-y-2 text-xs text-muted/60 leading-relaxed">
                    <div className="flex items-start gap-1.5">
                      <AlertCircle className="w-3 h-3 text-amber-400/60 shrink-0 mt-0.5" />
                      <span>审核由 AI 自动完成，可能存在误判情况，属正常现象</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <AlertCircle className="w-3 h-3 text-amber-400/60 shrink-0 mt-0.5" />
                      <span>评判标准：生成图与原图的主体是否一致（人物/商品等核心元素）</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <AlertCircle className="w-3 h-3 text-amber-400/60 shrink-0 mt-0.5" />
                      <span>若申诉图片中夹带有主体一致的图片，误判驳回的概率会增大</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <AlertCircle className="w-3 h-3 text-amber-400/60 shrink-0 mt-0.5" />
                      <span>如有误判，请联系右下角客服微信进行人工复核</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ─── Empty state ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl overflow-hidden"
            >
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-4">
                  <FileText className="w-7 h-7 text-muted/20" />
                </div>
                <p className="text-sm text-muted/50 font-medium mb-1">暂无售后记录</p>
                <p className="text-xs text-muted/30">您还没有提交过任何申诉</p>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
      <ScrollToTop />
    </div>
  );
}
