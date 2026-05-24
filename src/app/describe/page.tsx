"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  FileText,
  ChevronDown,
  Clock,
  ShoppingBag,
  Globe,
  Package,
  Camera,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { GlowOrb } from "@/components/GlowOrb";
import { Sidebar } from "@/components/Sidebar";
import { ScrollToTop } from "@/components/ScrollToTop";

/* ─── Data ─── */

const platforms = [
  { id: "domestic", label: "国内电商", desc: "淘宝 / 京东 / 拼多多", icon: ShoppingBag },
  { id: "shopee", label: "虾皮 Shopee", desc: "东南亚 / 台湾", icon: Globe },
  { id: "amazon", label: "亚马逊", desc: "Amazon 全球站点", icon: Package },
  { id: "sku", label: "SKU 白底图", desc: "纯白背景产品图", icon: Camera },
];

/* ─── Component ─── */

export default function DescribePage() {
  const [platform, setPlatform] = useState(platforms[0]);
  const [platformOpen, setPlatformOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const canGenerate = productName.trim().length > 0;

  const handleGenerate = useCallback(() => {
    if (!canGenerate) return;
    setIsGenerating(true);
    setTimeout(() => {
      const desc = `【${productName}】

✨ 产品亮点：
• 精选优质材质，手感细腻舒适
• 人性化设计，使用便捷高效
• 简约时尚外观，彰显品质生活

📦 产品规格：
• 材质：304 不锈钢 + 食品级硅胶
• 容量：500ml
• 尺寸：7.2 × 7.2 × 22.5cm
• 重量：约 320g

🎯 适用场景：
日常通勤 / 户外运动 / 办公室 / 居家休闲

💡 核心卖点：
12 小时长效保温，真空断热技术，锁住每一度温暖。防漏设计，倒置不漏水，随心携带无顾虑。`;
      setResult(desc);
      setHistory((prev) => [productName, ...prev]);
      setIsGenerating(false);
    }, 2500);
  }, [canGenerate, productName]);

  const selectedPlatform = platforms.find((p) => p.id === platform.id) ?? platforms[0];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <GlowOrb color="rgba(16, 185, 129, 0.10)" className="top-0 right-1/4" size={450} />
      <GlowOrb color="rgba(139, 92, 246, 0.08)" className="top-1/3 -left-16" size={350} />
      <GlowOrb color="rgba(6, 182, 212, 0.06)" className="-bottom-20 left-1/3" size={400} />

      <div className="fixed inset-0 bg-grid pointer-events-none" />

      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 pt-24 pb-16 px-6 lg:px-8 min-w-0">
          <div className="mx-auto max-w-6xl">
            {/* ─── Header ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mb-8"
            >
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
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-md shadow-emerald-500/25">
                    <FileText className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h1 className="text-xl font-semibold tracking-tight text-white">
                    智能商品描述
                  </h1>
                </div>
              </div>
              <p className="text-sm text-muted ml-[132px]">
                AI 自动生成商品描述文案 · 支持多平台适配
              </p>
            </motion.div>

            {/* ─── Main layout: Left settings + Right preview ─── */}
            <div className="flex gap-6">
              {/* ── Left: Settings ── */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
                className="w-[300px] shrink-0"
              >
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-5">
                  {/* Platform selector */}
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                      选择平台
                    </p>
                    <div className="relative">
                      <button
                        onClick={() => setPlatformOpen(!platformOpen)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 ${
                          platformOpen
                            ? "border-emerald-400/40 bg-white/[0.06]"
                            : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.14] hover:bg-white/[0.05]"
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
                          <selectedPlatform.icon className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white">{selectedPlatform.label}</p>
                          <p className="text-[11px] text-muted/50">{selectedPlatform.desc}</p>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-muted transition-transform duration-200 ${
                            platformOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {platformOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.15 }}
                            className="absolute inset-x-0 top-full mt-1.5 p-1.5 rounded-xl border border-white/[0.08] bg-[#0f0a2e]/95 backdrop-blur-xl shadow-xl z-20"
                          >
                            {platforms.map((p) => {
                              const isSel = platform.id === p.id;
                              return (
                                <button
                                  key={p.id}
                                  onClick={() => {
                                    setPlatform(p);
                                    setPlatformOpen(false);
                                  }}
                                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                                    isSel
                                      ? "bg-emerald-500/10 text-white"
                                      : "text-muted hover:text-white hover:bg-white/[0.04]"
                                  }`}
                                >
                                  <p.icon
                                    className={`w-4 h-4 ${isSel ? "text-emerald-400" : "text-muted/40"}`}
                                  />
                                  <div>
                                    <p className="text-xs font-semibold">{p.label}</p>
                                    <p className="text-[10px] text-muted/50">{p.desc}</p>
                                  </div>
                                  {isSel && (
                                    <span className="ml-auto text-[10px] text-emerald-400">✓</span>
                                  )}
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Product name */}
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                      商品名称
                    </p>
                    <textarea
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="输入商品名称，如：不锈钢保温杯..."
                      rows={3}
                      className="w-full px-4 py-3 text-sm text-white placeholder-muted/30 bg-white/[0.03] border border-white/[0.08] rounded-xl focus:outline-none focus:border-emerald-400/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(16,185,129,0.08)] transition-all duration-300 resize-none"
                    />

                    {/* Generate button */}
                    <motion.button
                      whileHover={canGenerate ? { scale: 1.01 } : undefined}
                      whileTap={canGenerate ? { scale: 0.97 } : undefined}
                      onClick={handleGenerate}
                      disabled={!canGenerate || isGenerating}
                      className="w-full relative mt-3 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white rounded-xl overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500" />
                      <span className="relative z-10 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        {isGenerating ? "生成中..." : "生成文案 (15 积分/次)"}
                      </span>
                    </motion.button>
                  </div>

                  {/* History */}
                  <div>
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      历史记录
                      <span className="text-[10px] text-muted/40 font-normal normal-case">
                        {history.length} 条
                      </span>
                    </p>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                      {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-muted/40">
                          <Clock className="w-6 h-6 mb-2" />
                          <span className="text-xs">暂无历史记录</span>
                        </div>
                      ) : (
                        <div className="max-h-[200px] overflow-y-auto">
                          {history.map((name, i) => (
                            <button
                              key={i}
                              onClick={() => setProductName(name)}
                              className="w-full text-left px-4 py-2.5 text-xs text-muted hover:text-white hover:bg-white/[0.04] border-b border-white/[0.04] last:border-0 transition-colors duration-150 truncate"
                            >
                              {name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ── Right: Preview ── */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                className="flex-1 min-w-0"
              >
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-5">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">
                    文案预览
                  </p>

                  <AnimatePresence mode="wait">
                    {isGenerating ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="rounded-xl border border-white/[0.06] bg-[#060312]/80 p-8 flex flex-col items-center justify-center min-h-[400px]"
                      >
                        <div className="w-full max-w-md space-y-4">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="h-4 rounded-full bg-white/[0.04] skeleton-shimmer"
                              style={{ width: `${85 - i * 15}%` }}
                            />
                          ))}
                          <div className="h-4 rounded-full bg-white/[0.04] skeleton-shimmer w-2/3" />
                          <div className="h-4 rounded-full bg-white/[0.04] skeleton-shimmer w-1/2" />
                        </div>
                        <div className="flex items-center gap-2 mt-6 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/[0.06]">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="w-3 h-3 text-emerald-400" />
                          </motion.div>
                          <span className="text-xs font-medium text-muted">AI 正在生成文案...</span>
                        </div>
                      </motion.div>
                    ) : result ? (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="rounded-xl border border-emerald-400/15 bg-[#060312]/80 p-6 min-h-[400px]"
                      >
                        <pre className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap font-sans">
                          {result}
                        </pre>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="rounded-xl border border-white/[0.06] bg-[#060312]/80 flex flex-col items-center justify-center min-h-[400px]"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.04] flex items-center justify-center mb-3">
                          <FileText className="w-6 h-6 text-muted/30" />
                        </div>
                        <p className="text-sm text-muted/50 font-medium">生成的文案将在这里显示</p>
                        <p className="text-xs text-muted/30 mt-1">
                          输入商品名称并选择平台后点击生成
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
      <ScrollToTop />
    </div>
  );
}
