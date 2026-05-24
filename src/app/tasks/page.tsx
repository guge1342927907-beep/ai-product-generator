"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ListTodo,
  RefreshCw,
  Search,
  Image as ImageIcon,
  Video,
  Sparkles,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { GlowOrb } from "@/components/GlowOrb";
import { Sidebar } from "@/components/Sidebar";
import { ScrollToTop } from "@/components/ScrollToTop";

/* ─── Types ─── */

type TaskTab = "image" | "video";

/* ─── Component ─── */

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState<TaskTab>("image");
  const [search, setSearch] = useState("");

  const tabs: { id: TaskTab; label: string; icon: typeof ImageIcon }[] = [
    { id: "image", label: "图片任务", icon: ImageIcon },
    { id: "video", label: "视频任务", icon: Video },
  ];

  const isEmpty = true; // mock: always empty for now

  return (
    <div className="relative min-h-screen overflow-hidden">
      <GlowOrb color="rgba(139, 92, 246, 0.12)" className="top-0 left-1/4" size={500} />
      <GlowOrb color="rgba(6, 182, 212, 0.06)" className="top-1/3 -right-20" size={400} />
      <GlowOrb color="rgba(139, 92, 246, 0.06)" className="-bottom-32 left-1/2" size={500} />

      <div className="fixed inset-0 bg-grid pointer-events-none" />

      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 pt-24 pb-16 px-6 lg:px-8 min-w-0">
          <div className="mx-auto max-w-4xl">
            {/* ─── Header row ─── */}
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
                      <ListTodo className="w-3.5 h-3.5 text-white" />
                    </div>
                    <h1 className="text-xl font-semibold tracking-tight text-white">
                      任务队列
                    </h1>
                  </div>
                </div>
                <p className="text-sm text-muted ml-[132px]">
                  查看所有生成任务的状态，包括进行中、已完成和失败的任务
                </p>
              </div>

              {/* Refresh button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95, rotate: -30 }}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted hover:text-white rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.14] transition-all duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                刷新
              </motion.button>
            </motion.div>

            {/* ─── Tabs + Search ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
              className="mb-6"
            >
              <div className="flex items-center gap-4">
                {/* Tabs */}
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
                          isActive
                            ? "text-white"
                            : "text-muted hover:text-white"
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="tasks-tab-bg"
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

                {/* Search */}
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/40" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="搜索产品名称..."
                    className="w-full pl-9 pr-4 py-2.5 text-sm text-white placeholder-muted/30 bg-white/[0.03] border border-white/[0.08] rounded-xl focus:outline-none focus:border-purple-accent/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(139,92,246,0.08)] transition-all duration-300"
                  />
                </div>
              </div>
            </motion.div>

            {/* ─── Status legend ─── */}
            {!isEmpty && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-5 mb-4 px-1"
              >
                {[
                  { color: "bg-amber-400", label: "进行中", icon: Loader2 },
                  { color: "bg-emerald-400", label: "已完成", icon: CheckCircle2 },
                  { color: "bg-red-400", label: "失败", icon: XCircle },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${s.color}`} />
                    <span className="text-[11px] text-muted/50">{s.label}</span>
                  </div>
                ))}
              </motion.div>
            )}

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
                    className="flex flex-col items-center justify-center py-20"
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
                      className="relative mb-6"
                    >
                      <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                        {activeTab === "image" ? (
                          <ImageIcon className="w-10 h-10 text-muted/20" />
                        ) : (
                          <Video className="w-10 h-10 text-muted/20" />
                        )}
                      </div>
                      <motion.div
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-2xl ring-1 ring-purple-accent/10"
                      />
                    </motion.div>

                    <p className="text-base font-semibold text-white mb-1.5">
                      暂无{activeTab === "image" ? "图片" : "视频"}任务
                    </p>
                    <p className="text-sm text-muted/50 mb-8">
                      {activeTab === "image" ? "去首页生成一张九宫格作品吧" : "去生成一个视频吧"}
                    </p>

                    <Link href={activeTab === "image" ? "/generate" : "/video"}>
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative flex items-center gap-2.5 px-8 py-3.5 text-base font-semibold text-white rounded-2xl overflow-hidden shadow-2xl shadow-purple-accent/25 group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-accent to-cyber-blue bg-[length:200%_100%] group-hover:animate-shimmer" />
                        <span className="relative z-10 flex items-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          去生成
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </motion.button>
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-5"
                  >
                    <p className="text-sm text-muted/40 text-center py-12">任务列表加载中...</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Task list header — only shown when there are tasks */}
              {!isEmpty && (
                <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/[0.06] text-[11px] font-semibold text-muted/50 uppercase tracking-wider">
                  <span className="col-span-5">任务</span>
                  <span className="col-span-2">类型</span>
                  <span className="col-span-2">状态</span>
                  <span className="col-span-2">时间</span>
                  <span className="col-span-1" />
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>
      <ScrollToTop />
    </div>
  );
}
