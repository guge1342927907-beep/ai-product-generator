"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Image as ImageIcon,
  Video,
  Search,
  Sparkles,
  ListTodo,
  ChevronRight,
  LayoutGrid,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { GlowOrb } from "@/components/GlowOrb";
import { Sidebar } from "@/components/Sidebar";
import { ScrollToTop } from "@/components/ScrollToTop";

/* ─── Types ─── */

type GalleryTab = "image" | "video";

/* ─── Component ─── */

export default function WorksPage() {
  const [activeTab, setActiveTab] = useState<GalleryTab>("image");
  const [search, setSearch] = useState("");

  const tabs: { id: GalleryTab; label: string; icon: typeof ImageIcon }[] = [
    { id: "image", label: "图片作品", icon: ImageIcon },
    { id: "video", label: "视频作品", icon: Video },
  ];

  const imageCount = 0;
  const videoCount = 0;
  const isEmpty = true;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <GlowOrb color="rgba(139, 92, 246, 0.10)" className="top-0 left-1/4" size={500} />
      <GlowOrb color="rgba(6, 182, 212, 0.05)" className="top-1/3 -right-16" size={380} />
      <GlowOrb color="rgba(139, 92, 246, 0.06)" className="-bottom-24 left-1/2" size={480} />

      <div className="fixed inset-0 bg-grid pointer-events-none" />

      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 pt-24 pb-16 px-6 lg:px-8 min-w-0">
          <div className="mx-auto max-w-5xl">
            {/* ─── Header ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex items-start justify-between mb-8"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <Link
                    href="/"
                    className="flex items-center gap-1.5 text-sm text-muted hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    返回首页
                  </Link>
                  <div className="w-px h-4 bg-white/[0.08]" />
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-accent to-cyber-blue flex items-center justify-center shadow-md shadow-purple-accent/25">
                      <LayoutGrid className="w-3.5 h-3.5 text-white" />
                    </div>
                    <h1 className="text-xl font-semibold tracking-tight text-white">
                      精品展馆
                    </h1>
                  </div>
                </div>
                <p className="text-sm text-muted ml-[132px] max-w-md leading-relaxed">
                  欣赏你的创意杰作，每一幅都是 AI 与灵感的完美结合
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <ImageIcon className="w-4 h-4 text-purple-accent/60" />
                  <span className="text-sm text-white font-semibold">{imageCount}</span>
                  <span className="text-xs text-muted/50">图片作品</span>
                </div>
                <div className="w-px h-6 bg-white/[0.06]" />
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <Video className="w-4 h-4 text-cyber-blue/60" />
                  <span className="text-sm text-white font-semibold">{videoCount}</span>
                  <span className="text-xs text-muted/50">视频作品</span>
                </div>
              </div>
            </motion.div>

            {/* ─── Tabs + Search ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="flex gap-1.5 p-1 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      whileHover={!isActive ? { scale: 1.02 } : undefined}
                      whileTap={!isActive ? { scale: 0.97 } : undefined}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                        isActive ? "text-white" : "text-muted hover:text-white"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="gallery-tab-bg"
                          className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-accent/80 to-cyber-blue/60 shadow-lg shadow-purple-accent/20"
                          transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                        />
                      )}
                      <tab.icon className={`w-4 h-4 relative z-10 ${isActive ? "text-white" : "text-muted/50"}`} />
                      <span className="relative z-10">{tab.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/40" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="搜索作品名称..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm text-white placeholder-muted/30 bg-white/[0.03] border border-white/[0.08] rounded-xl focus:outline-none focus:border-purple-accent/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(139,92,246,0.08)] transition-all duration-300"
                />
              </div>
            </motion.div>

            {/* ─── Content ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {isEmpty ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-24"
                  >
                    {/* Icon with glow */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
                      className="relative mb-8"
                    >
                      <div className="w-24 h-24 rounded-3xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center">
                        {activeTab === "image" ? (
                          <ImageIcon className="w-12 h-12 text-muted/15" />
                        ) : (
                          <Video className="w-12 h-12 text-muted/15" />
                        )}
                      </div>
                      <motion.div
                        animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.02, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-3xl ring-1 ring-purple-accent/10"
                      />
                    </motion.div>

                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="text-lg font-semibold text-white mb-2"
                    >
                      {activeTab === "image" ? "展馆暂无作品" : "暂无视频作品"}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25, duration: 0.4 }}
                      className="text-sm text-muted/50 mb-10"
                    >
                      {activeTab === "image"
                        ? "完成的作品将在这里展示，去「任务队列」查看进行中的任务"
                        : "完成的视频将在这里展示"}

                    </motion.p>

                    {/* Action buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="flex items-center gap-3"
                    >
                      <Link href="/tasks">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.96 }}
                          className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-muted hover:text-white rounded-2xl border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.18] transition-all duration-200"
                        >
                          <ListTodo className="w-4 h-4" />
                          查看任务队列
                          <ChevronRight className="w-3.5 h-3.5" />
                        </motion.button>
                      </Link>

                      <Link href={activeTab === "image" ? "/generate" : "/video"}>
                        <motion.button
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative flex items-center gap-2.5 px-8 py-3.5 text-sm font-semibold text-white rounded-2xl overflow-hidden shadow-2xl shadow-purple-accent/25 group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-accent to-cyber-blue bg-[length:200%_100%] group-hover:animate-shimmer" />
                          <span className="relative z-10 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            {activeTab === "image" ? "创建新作品" : "生成视频"}
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </motion.button>
                      </Link>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="gallery"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-5"
                  >
                    {/* Gallery grid would go here */}
                    <div className="grid grid-cols-4 gap-3">
                      {/* Placeholder for actual gallery items */}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </main>
      </div>
      <ScrollToTop />
    </div>
  );
}
