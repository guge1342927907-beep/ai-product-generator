"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Layers,
  Camera,
  ShoppingBag,
  Package,
  Sparkles,
  ArrowLeft,
  Flame,
  Gift,
  ChevronRight,
  ChevronDown,
  Globe,
  Monitor,
  Store,
  Shirt,
  Star,
  ShoppingCart,
  Gem,
  BadgeCheck,
  Crown,
  Image,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { GlowOrb } from "@/components/GlowOrb";
import { Sidebar } from "@/components/Sidebar";
import { UploadZone } from "@/components/UploadZone";
import { ModelSelector, models } from "@/components/ModelSelector";
import { ResultPanel } from "@/components/ResultPanel";
import { ScrollToTop } from "@/components/ScrollToTop";

/* ─── Data ─── */

const generationModes: { id: Mode; label: string; desc: string; price: string; icon: typeof Zap; features: string[]; badge?: string }[] = [
  {
    id: "standard",
    label: "标准极速",
    desc: "快速出图，适合批量操作",
    price: "199 积分起",
    icon: Zap,
    features: ["快速出图", "标准画质", "适合批量操作"],
  },
  {
    id: "pro",
    label: "PRO 增强",
    desc: "高画质精品，细节增强",
    price: "100 积分/张",
    icon: Crown,
    features: ["高画质精品", "细节增强", "优先处理"],
    badge: "推荐",
  },
];

const generationTypes = [
  { id: "main", label: "主图生成", icon: ShoppingBag },
  { id: "detail", label: "详情页", icon: Layers },
];

const platforms = [
  { id: "domestic", label: "国内电商", sublabel: "淘宝/京东/拼多多", icon: Monitor, color: "from-purple-accent to-cyber-blue" },
  { id: "shopee", label: "虾皮", sublabel: "Shopee", icon: Store, color: "from-orange-500 to-red-500" },
  { id: "amazon", label: "亚马逊", sublabel: "Amazon", icon: Globe, color: "from-amber-500 to-orange-500" },
  { id: "general", label: "通用", sublabel: "全平台适配", icon: Image, color: "from-slate-400 to-slate-300" },
];

type PlatformStyle = {
  icon: typeof Shirt;
  label: string;
  tag?: string;
};

const platformStyles: Record<string, PlatformStyle[]> = {
  domestic: [
    { icon: ShoppingBag, label: "国内自适应风格" },
    { icon: FileText, label: "国内自适应风格（无字）" },
    { icon: BadgeCheck, label: "国内自适应（优化版）", tag: "优化" },
  ],
  shopee: [
    { icon: Shirt, label: "服装" },
    { icon: Star, label: "馬年新年喜氣" },
    { icon: Gem, label: "家電 / 家居 / 收納" },
    { icon: Package, label: "百货类" },
    { icon: ShoppingCart, label: "通用类" },
  ],
  amazon: [
    { icon: FileText, label: "亚马逊无字无文案" },
    { icon: ShoppingBag, label: "亚马逊自适应风格" },
  ],
  general: [
    { icon: Camera, label: "SKU白底图" },
  ],
};

/* PRO专属风格 */
const proPlatformStyles: Record<string, PlatformStyle[]> = {
  domestic: [
    { icon: BadgeCheck, label: "国内通用主图PRO", tag: "4.29优化" },
    { icon: ShoppingBag, label: "国内通用主图PRO" },
  ],
  amazon: [
    { icon: FileText, label: "亚马逊主图无字无文案" },
    { icon: ShoppingBag, label: "亚马逊主图" },
  ],
  general: [
    { icon: Camera, label: "首图白底", tag: "首图" },
  ],
};

/* 标准版详情页专属风格 */
const detailPlatformStyles: Record<string, PlatformStyle[]> = {
  domestic: [{ icon: Layers, label: "国内电商详情页" }],
  shopee: [{ icon: Layers, label: "虾皮详情页" }],
  amazon: [{ icon: Layers, label: "亚马逊详情页" }],
  general: [{ icon: Layers, label: "TK详情页" }],
};

const imageCountOptionsMain = [
  { count: 1, credits: 100, label: "1 张" },
  { count: 3, credits: 250, label: "3 张" },
  { count: 5, credits: 350, label: "5 张" },
  { count: 9, credits: 500, label: "9 张", badge: "特惠" },
];

const imageCountOptionsDetail = [
  { count: 1, credits: 100, label: "1 张" },
  { count: 3, credits: 250, label: "3 张" },
  { count: 5, credits: 350, label: "5 张" },
  { count: 9, credits: 500, label: "9 张", badge: "特惠" },
  { count: 14, credits: 700, label: "14 张" },
];

const getImageCountOptions = (genType: string) =>
  genType === "detail" ? imageCountOptionsDetail : imageCountOptionsMain;

const languages = [
  { id: "zh-CN", label: "简体中文" },
  { id: "zh-TW", label: "繁體中文" },
  { id: "en", label: "英文" },
  { id: "ja", label: "日文" },
  { id: "ko", label: "韩文" },
  { id: "ru", label: "俄文" },
  { id: "es", label: "西班牙文" },
  { id: "pt", label: "葡萄牙文" },
  { id: "fr", label: "法文" },
  { id: "de", label: "德文" },
  { id: "ar", label: "阿拉伯文" },
  { id: "th", label: "泰文" },
  { id: "vi", label: "越南文" },
  { id: "id", label: "印尼文" },
  { id: "ms", label: "马来文" },
  { id: "hi", label: "印地文" },
];

const aspectRatios = [
  { id: "1:1", label: "1:1", desc: "正方形" },
  { id: "3:4", label: "3:4", desc: "竖版" },
  { id: "4:3", label: "4:3", desc: "横版" },
  { id: "16:9", label: "16:9", desc: "宽屏" },
];

/* ─── Component ─── */

type Mode = "standard" | "pro";

export default function GeneratePage() {
  const [mode, setMode] = useState<Mode>("standard");
  const [selectedStyle, setSelectedStyle] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [generationType, setGenerationType] = useState("main");
  const [selectedPlatform, setSelectedPlatform] = useState("domestic");
  const [productTitle, setProductTitle] = useState("");
  const [productFeatures, setProductFeatures] = useState("");
  const [visualStyle, setVisualStyle] = useState("");
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [imageCount, setImageCount] = useState(9);
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [langOpen, setLangOpen] = useState(false);
  const [batchType, setBatchType] = useState("firstSix");

  const isDetailMode = mode === "standard" && generationType === "detail";

  const currentStyles =
    mode === "pro"
      ? (proPlatformStyles[selectedPlatform] ?? proPlatformStyles.domestic)
      : isDetailMode
        ? (detailPlatformStyles[selectedPlatform] ?? detailPlatformStyles.domestic)
        : (platformStyles[selectedPlatform] ?? platformStyles.domestic);

  const visiblePlatforms =
    mode === "pro"
      ? platforms.filter((p) => p.id !== "shopee")
      : isDetailMode
        ? platforms.map((p) => (p.id === "general" ? { ...p, label: "TK", sublabel: "TikTok" } : p))
        : platforms;

  const totalCredits =
    mode === "pro"
      ? (getImageCountOptions(generationType).find((o) => o.count === imageCount)?.credits ?? 500)
      : 199;

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    setGeneratedCount(0);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedCount(imageCount);
    }, 3000);
  }, [imageCount]);

  const handleGenTypeChange = (gt: string) => {
    setGenerationType(gt);
    // Reset image count to a valid default for the new type
    setImageCount(gt === "detail" ? 9 : 9);
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setSelectedStyle(0);
    // If current platform is not valid in the new mode, reset to domestic
    const targetStyles = newMode === "pro" ? proPlatformStyles : platformStyles;
    if (!targetStyles[selectedPlatform]) {
      setSelectedPlatform("domestic");
    }
  };

  const handlePlatformChange = (platformId: string) => {
    setSelectedPlatform(platformId);
    setSelectedStyle(0);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <GlowOrb color="rgba(139, 92, 246, 0.12)" className="top-0 left-1/4" size={500} />
      <GlowOrb color="rgba(6, 182, 212, 0.08)" className="top-1/3 -right-20" size={400} />
      <GlowOrb color="rgba(139, 92, 246, 0.06)" className="-bottom-32 left-1/2" size={500} />
      {mode === "pro" && (
        <GlowOrb color="rgba(249, 115, 22, 0.08)" className="top-1/2 left-1/3" size={350} />
      )}

      <div className="fixed inset-0 bg-grid pointer-events-none" />

      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 pt-24 pb-16 px-6 lg:px-8 min-w-0">
          <div className="mx-auto max-w-7xl">
            {/* ─── Header: Breadcrumb + Title + Mode Selector ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
            >
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="flex items-center gap-1.5 text-sm text-muted hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  返回首页
                </Link>
                <div className="w-px h-4 bg-white/[0.08]" />
                <h1 className="text-xl font-semibold tracking-tight text-white">
                  创建新作品
                </h1>
              </div>

              {/* Desktop: mode cards */}
              <div className="hidden sm:flex items-stretch gap-3">
                {generationModes.map((m) => {
                  const isPro = m.id === "pro";
                  const isActive = mode === m.id;
                  return (
                    <motion.button
                      key={m.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleModeChange(m.id)}
                      className={`relative flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-300 ${
                        isActive
                          ? isPro
                            ? "border-orange-400/50 bg-gradient-to-br from-orange-500/15 to-amber-500/10 shadow-[0_0_24px_rgba(249,115,22,0.15)]"
                            : "border-purple-accent/50 bg-gradient-to-br from-purple-accent/15 to-cyber-blue/10 glow-ring"
                          : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.14] hover:bg-white/[0.05]"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isActive
                            ? isPro
                              ? "bg-orange-500/20 text-orange-400"
                              : "bg-purple-accent/20 text-purple-accent"
                            : "bg-white/[0.06] text-muted"
                        }`}
                      >
                        <m.icon className="w-4.5 h-4.5" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">
                            {m.label}
                          </span>
                          {m.badge && (
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                                isActive
                                  ? "bg-orange-500/20 text-orange-400"
                                  : "bg-purple-accent/15 text-purple-accent"
                              }`}
                            >
                              {m.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted mt-0.5">{m.price}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Mobile: mode cards */}
            <div className="sm:hidden mb-6">
              <div className="grid grid-cols-2 gap-3">
                {generationModes.map((m) => {
                  const isPro = m.id === "pro";
                  const isActive = mode === m.id;
                  return (
                    <motion.button
                      key={m.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleModeChange(m.id)}
                      className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300 ${
                        isActive
                          ? isPro
                            ? "border-orange-400/40 bg-gradient-to-br from-orange-500/15 to-amber-500/10"
                            : "border-purple-accent/50 bg-gradient-to-br from-purple-accent/15 to-cyber-blue/10 glow-ring"
                          : "border-white/[0.06] bg-white/[0.02]"
                      }`}
                    >
                      <m.icon
                        className={`w-5 h-5 ${
                          isActive
                            ? isPro
                              ? "text-orange-400"
                              : "text-purple-accent"
                            : "text-muted"
                        }`}
                      />
                      <div className="text-center">
                        <p className="text-sm font-semibold text-white">{m.label}</p>
                        <p className="text-xs text-muted mt-0.5">{m.price}</p>
                      </div>
                      {m.badge && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-orange-500/20 text-[10px] font-bold text-orange-400">
                          {m.badge}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* ─── 3-column layout ─── */}
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
              {/* ── Left: Upload + Tips ── */}
              <div className="flex flex-col gap-4">
                <UploadZone />

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md"
                >
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                    生成提示
                  </p>
                  <ul className="space-y-2">
                    {[
                      "使用光线充足、对焦清晰的产品图",
                      "避免杂乱或复杂的背景",
                      "产品居中放置在画面中间",
                      "建议分辨率 1024x1024 以上",
                    ].map((tip) => (
                      <li
                        key={tip}
                        className="flex items-start gap-2 text-xs text-muted/70"
                      >
                        <span className="mt-0.5 w-1 h-1 rounded-full bg-purple-accent/60 shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* ── Center: Config + Styles + Generate ── */}
              <div>
                {/* Model selector */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                    选择模型
                  </p>
                  <ModelSelector
                    selected={selectedModel}
                    onSelect={setSelectedModel}
                  />
                </div>

                {/* Generation type toggle */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                    生成内容
                  </p>
                  <div className="flex gap-2">
                    {generationTypes.map((gt) => (
                      <button
                        key={gt.id}
                        onClick={() => handleGenTypeChange(gt.id)}
                        className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                          generationType === gt.id
                            ? "text-white"
                            : "text-muted hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        {generationType === gt.id && (
                          <motion.div
                            layoutId="gen-type-bg"
                            className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-accent/80 to-cyber-blue/60 shadow-lg shadow-purple-accent/20"
                            transition={{
                              type: "spring",
                              bounce: 0.15,
                              duration: 0.5,
                            }}
                          />
                        )}
                        <gt.icon className="w-4 h-4 relative z-10" />
                        <span className="relative z-10">{gt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Batch selector (standard mode + 详情页 only) */}
                <AnimatePresence>
                  {mode === "standard" && generationType === "detail" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                        生成批次
                      </p>
                      <div className="flex gap-2">
                        {[
                          { id: "firstSix", label: "前六屏" },
                          { id: "lastSix", label: "后六屏" },
                        ].map((b) => {
                          const isActive = batchType === b.id;
                          return (
                            <button
                              key={b.id}
                              onClick={() => setBatchType(b.id)}
                              className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                                isActive
                                  ? "text-white"
                                  : "text-muted hover:text-white hover:bg-white/[0.04]"
                              }`}
                            >
                              {isActive && (
                                <motion.div
                                  layoutId="batch-bg"
                                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-accent/80 to-cyber-blue/60 shadow-lg shadow-purple-accent/20"
                                  transition={{
                                    type: "spring",
                                    bounce: 0.15,
                                    duration: 0.5,
                                  }}
                                />
                              )}
                              <Layers className="w-4 h-4 relative z-10" />
                              <span className="relative z-10">{b.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── PRO control panel (visible only when PRO mode is active) ── */}
                <AnimatePresence mode="wait">
                  {mode === "pro" && (
                    <motion.div
                      key="pro-panel"
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 rounded-2xl border border-orange-400/20 bg-gradient-to-br from-orange-500/[0.06] via-amber-500/[0.04] to-orange-500/[0.02] backdrop-blur-xl relative">
                        {/* Premium glow */}
                        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-orange-400/5 via-amber-500/3 to-transparent pointer-events-none" />

                        {/* Header */}
                        <div className="flex items-center gap-2.5 mb-4">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-500/20">
                            <Crown className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span className="text-sm font-bold text-white tracking-wide">
                            PRO 控制台
                          </span>
                          <span className="ml-auto text-[9px] font-medium text-orange-400/50 tracking-widest uppercase">
                            ENHANCED MODE
                          </span>
                        </div>

                        {/* Image count */}
                        <div className="mb-4">
                          <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2.5">
                            生成张数
                          </p>
                          <div className="flex gap-1.5">
                            {getImageCountOptions(generationType).map((opt) => {
                              const isActive = imageCount === opt.count;
                              return (
                                <motion.button
                                  key={opt.count}
                                  whileHover={{ scale: 1.04 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setImageCount(opt.count)}
                                  className={`relative flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-all duration-300 ${
                                    isActive
                                      ? "border-orange-400/60 bg-gradient-to-b from-orange-500/20 to-amber-500/10 shadow-[0_0_16px_rgba(249,115,22,0.12)]"
                                      : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04]"
                                  }`}
                                >
                                  <span
                                    className={`text-xs font-bold ${
                                      isActive ? "text-white" : "text-muted"
                                    }`}
                                  >
                                    {opt.label}
                                  </span>
                                  <span
                                    className={`text-[9px] font-medium ${
                                      isActive ? "text-orange-400/80" : "text-muted/40"
                                    }`}
                                  >
                                    {opt.credits}
                                  </span>
                                  {opt.badge && (
                                    <span className="absolute -top-1.5 -right-1 px-1.5 py-0.5 rounded bg-orange-500 text-[8px] font-bold text-white">
                                      {opt.badge}
                                    </span>
                                  )}
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Aspect ratio */}
                        <div>
                          <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2.5">
                            画幅比例
                          </p>
                          <div className="flex gap-1.5">
                            {aspectRatios.map((ratio) => {
                              const isActive = aspectRatio === ratio.id;
                              return (
                                <motion.button
                                  key={ratio.id}
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.96 }}
                                  onClick={() => setAspectRatio(ratio.id)}
                                  className={`relative flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all duration-300 ${
                                    isActive
                                      ? "border-orange-400/50 bg-gradient-to-b from-orange-500/20 to-amber-500/10 shadow-[0_0_16px_rgba(249,115,22,0.12)]"
                                      : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04]"
                                  }`}
                                >
                                  <span
                                    className={`text-sm font-bold ${
                                      isActive ? "text-white" : "text-muted"
                                    }`}
                                  >
                                    {ratio.label}
                                  </span>
                                  <span
                                    className={`text-[9px] font-medium ${
                                      isActive ? "text-orange-400/60" : "text-muted/30"
                                    }`}
                                  >
                                    {ratio.desc}
                                  </span>
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Platform + Style: left-right split ── */}
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.05, ease: "easeOut" }}
                  className="mb-5 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl"
                >
                  <div className="grid grid-cols-5 gap-5">
                    {/* Left: Platform selector */}
                    <div className="col-span-2">
                      <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-3">
                        目标平台
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {visiblePlatforms.map((p) => {
                          const isActive = selectedPlatform === p.id;
                          return (
                            <motion.button
                              key={p.id}
                              whileHover={{ x: 2 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handlePlatformChange(p.id)}
                              className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all duration-300 ${
                                isActive
                                  ? "text-white"
                                  : "text-muted hover:text-white hover:bg-white/[0.04]"
                              }`}
                            >
                              {isActive && (
                                <motion.div
                                  layoutId="platform-active"
                                  className={`absolute inset-0 rounded-xl bg-gradient-to-r ${p.color} opacity-90 shadow-lg`}
                                  transition={{
                                    type: "spring",
                                    bounce: 0.15,
                                    duration: 0.45,
                                  }}
                                />
                              )}
                              <p.icon
                                className={`w-4 h-4 relative z-10 shrink-0 ${
                                  isActive ? "text-white" : "text-muted/40"
                                }`}
                              />
                              <div className="relative z-10 min-w-0">
                                <p className="text-sm font-semibold leading-tight">
                                  {p.label}
                                </p>
                                <p
                                  className={`text-[10px] leading-tight ${
                                    isActive ? "text-white/70" : "text-muted/50"
                                  }`}
                                >
                                  {p.sublabel}
                                </p>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right: Style grid */}
                    <div className="col-span-3 pl-1">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                          选择风格
                        </p>
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={selectedPlatform}
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            transition={{ duration: 0.2 }}
                            className="text-[10px] font-medium text-purple-accent/70"
                          >
                            {platforms.find((p) => p.id === selectedPlatform)?.label}{" "}
                            专属
                          </motion.span>
                        </AnimatePresence>
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={selectedPlatform}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="grid grid-cols-4 gap-2"
                        >
                          {currentStyles.map((style, i) => {
                            const isActive = selectedStyle === i;
                            return (
                              <motion.button
                                key={style.label}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => setSelectedStyle(i)}
                                className={`relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all duration-300 ${
                                  isActive
                                    ? "border-purple-accent/60 bg-gradient-to-br from-purple-accent/20 to-cyber-blue/10 glow-ring"
                                    : "border-white/[0.05] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]"
                                }`}
                              >
                                {isActive && (
                                  <motion.div
                                    layoutId="style-active-dot"
                                    className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-purple-accent"
                                    transition={{
                                      type: "spring",
                                      bounce: 0.3,
                                      duration: 0.4,
                                    }}
                                  />
                                )}
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                                    isActive
                                      ? "bg-purple-accent/25 text-purple-accent"
                                      : "bg-white/[0.04] text-muted/40"
                                  }`}
                                >
                                  <style.icon className="w-3.5 h-3.5" />
                                </div>
                                <span
                                  className={`text-[11px] font-medium leading-tight text-center transition-colors duration-200 ${
                                    isActive ? "text-white" : "text-muted/60"
                                  }`}
                                >
                                  {style.label}
                                </span>
                                {style.tag && (
                                  <span
                                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded leading-none ${
                                      isActive
                                        ? "bg-purple-accent/25 text-purple-accent"
                                        : "bg-white/[0.04] text-muted/40"
                                    }`}
                                  >
                                    {style.tag}
                                  </span>
                                )}
                              </motion.button>
                            );
                          })}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>

                {/* Product title input */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
                  className="mb-4"
                >
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                    产品标题
                  </p>
                  <div className="relative">
                    <input
                      type="text"
                      value={productTitle}
                      onChange={(e) => setProductTitle(e.target.value)}
                      placeholder="例如：泡茶杯 三件式泡茶杯 玻璃泡茶杯 泡"
                      className="w-full px-4 py-3 pr-12 text-sm text-white placeholder-muted/30 bg-white/[0.03] border border-white/[0.08] rounded-xl focus:outline-none focus:border-purple-accent/50 focus:bg-white/[0.06] transition-all duration-200"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-muted/30">
                      {productTitle.length}/200
                    </span>
                  </div>
                </motion.div>

                {/* Product features + Visual style (PRO only) */}
                <AnimatePresence>
                  {mode === "pro" && (
                    <motion.div
                      key="pro-extra-inputs"
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                          产品功能<span className="text-muted/40 font-normal ml-1">(可选)</span>
                        </p>
                        <input
                          type="text"
                          value={productFeatures}
                          onChange={(e) => setProductFeatures(e.target.value)}
                          placeholder="防水防汗、轻薄透气"
                          className="w-full px-4 py-3 text-sm text-white placeholder-muted/30 bg-white/[0.03] border border-white/[0.08] rounded-xl focus:outline-none focus:border-orange-400/40 focus:bg-white/[0.06] transition-all duration-200"
                        />
                      </div>

                      <div className="mb-4">
                        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                          画面风格<span className="text-muted/40 font-normal ml-1">(可选)</span>
                        </p>
                        <input
                          type="text"
                          value={visualStyle}
                          onChange={(e) => setVisualStyle(e.target.value)}
                          placeholder="赛博朋克、极简高级灰"
                          className="w-full px-4 py-3 text-sm text-white placeholder-muted/30 bg-white/[0.03] border border-white/[0.08] rounded-xl focus:outline-none focus:border-orange-400/40 focus:bg-white/[0.06] transition-all duration-200"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Output language */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
                  className="mb-4"
                >
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                    输出文字语言
                  </p>
                  <div className="relative">
                    <button
                      onClick={() => setLangOpen(!langOpen)}
                      className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:border-white/[0.14] transition-all duration-200"
                    >
                      <Globe className="w-4 h-4 text-muted" />
                      <span className="text-sm text-white">{selectedLanguage.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 ml-auto text-muted transition-transform duration-200 ${
                          langOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {langOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.15 }}
                          className="absolute inset-x-0 top-full mt-1.5 p-1.5 rounded-xl border border-white/[0.08] bg-[#0f0a2e]/95 backdrop-blur-xl shadow-xl z-20 max-h-[220px] overflow-y-auto"
                        >
                          {languages.map((lang) => (
                            <button
                              key={lang.id}
                              onClick={() => {
                                setSelectedLanguage(lang);
                                setLangOpen(false);
                              }}
                              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                                selectedLanguage.id === lang.id
                                  ? "bg-purple-accent/15 text-white"
                                  : "text-muted hover:text-white hover:bg-white/[0.04]"
                              }`}
                            >
                              <Globe className="w-3.5 h-3.5 text-muted/40" />
                              <span className="text-sm font-medium">{lang.label}</span>
                              {selectedLanguage.id === lang.id && (
                                <span className="ml-auto text-[10px] text-purple-accent">✓</span>
                              )}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* ── Generate button ── */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.18, ease: "easeOut" }}
                >
                  {mode === "pro" ? (
                    <div className="relative">
                      {/* PRO badge label */}
                      <div className="flex justify-center mb-3">
                        <motion.span
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 text-[11px] font-bold text-amber-400 tracking-wide"
                        >
                          <Crown className="w-3 h-3" />
                          PRO 增强模式
                        </motion.span>
                      </div>

                      {/* Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full relative flex flex-col items-center py-5 rounded-2xl overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{
                          boxShadow: "0 0 60px rgba(249,115,22,0.3), 0 8px 32px rgba(249,115,22,0.2)",
                        }}
                      >
                        {/* Animated gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 bg-[length:200%_100%] animate-shimmer" />
                        {/* Inner glow overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10" />

                        <span className="relative z-10 flex items-center gap-2.5 text-lg font-bold text-white tracking-wide">
                          <Crown className="w-5 h-5" />
                          {isGenerating ? "生成中..." : `生成 ${imageCount} 张`}
                        </span>
                      </motion.button>

                      {/* Credits cost */}
                      <p className="text-center text-sm font-semibold text-amber-400/80 mt-3">
                        消耗 {totalCredits} 积分
                      </p>

                      {/* PRO guarantees */}
                      <p className="text-center text-xs text-muted/50 mt-2">
                        PRO 专属提示词 · 按张计费 · 失败自动退币
                      </p>
                    </div>
                  ) : (
                    /* Standard: Purple gradient button */
                    <div>
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full relative flex items-center justify-center gap-3 py-4 text-base font-semibold text-white rounded-2xl overflow-hidden shadow-2xl shadow-purple-accent/25 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-accent via-cyber-blue to-purple-accent bg-[length:200%_100%] animate-shimmer" />
                        <span className="relative z-10 flex items-center gap-2.5">
                          <Sparkles className="w-5 h-5" />
                          {isGenerating
                            ? "生成中..."
                            : `生成图像 (消耗 ${totalCredits} 积分)`}
                        </span>
                      </motion.button>
                      <p className="text-center text-xs text-muted/50 mt-3">
                        一次生成即得 {imageCount} 张精选图
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* ── Right: Result ── */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                  className="mb-4"
                >
                  <h2 className="text-sm font-semibold text-white mb-1">生成结果</h2>
                  <p className="text-xs text-muted">AI 将为你生成 {imageCount} 张精选商品图</p>
                </motion.div>
                <ResultPanel isLoading={isGenerating} generatedCount={generatedCount} />
              </div>
            </div>

            {/* ── Bottom promo bar (hidden when PRO is active) ── */}
            {mode !== "pro" && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                exit={{ opacity: 0, y: 30 }}
                className="mt-10 p-5 rounded-2xl border border-orange-500/15 bg-gradient-to-r from-orange-500/[0.05] via-orange-500/[0.03] to-orange-500/[0.01] backdrop-blur-md"
              >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center shrink-0 border border-orange-500/20">
                      <Flame className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-white">
                          限时特惠 · PRO 增强 2.5 折
                        </p>
                        <span className="px-2 py-0.5 rounded-md bg-orange-500/20 text-[10px] font-bold text-orange-400 border border-orange-500/25">
                          限时
                        </span>
                      </div>
                      <p className="text-xs text-muted mt-0.5">
                        赠送水印解锁 (立省 100 积分) · 一次生成 9 张高清图 · 同时生成详情页
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleModeChange("pro")}
                      className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/20 shrink-0"
                    >
                      <Gift className="w-4 h-4" />
                      立即升级 PRO
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                    <span className="hidden sm:inline text-xs text-muted/60">
                      原价 299 积分
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
      <ScrollToTop />
    </div>
  );
}
