"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Crown,
  ChevronDown,
  Globe,
  Upload,
  Image as ImageIcon,
  Info,
  Copy,
  Lightbulb,
  X,
  AlertTriangle,
  Download,
  Maximize2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { GlowOrb } from "@/components/GlowOrb";
import { Sidebar } from "@/components/Sidebar";
import { ModelSelector, models } from "@/components/ModelSelector";
import { ScrollToTop } from "@/components/ScrollToTop";

/* ─── Data ─── */

const aspectRatios = [
  { id: "1:1", label: "1:1", desc: "正方形" },
  { id: "3:4", label: "3:4", desc: "竖版" },
  { id: "4:3", label: "4:3", desc: "横版" },
  { id: "16:9", label: "16:9", desc: "宽屏" },
  { id: "21:9", label: "21:9", desc: "超宽" },
  { id: "9:16", label: "9:16", desc: "竖屏" },
];

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

/* ─── Component ─── */

export default function ClonePage() {
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [productFeatures, setProductFeatures] = useState("");
  const [visualStyle, setVisualStyle] = useState("");
  const [productTitle, setProductTitle] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [langOpen, setLangOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);

  /* Upload states */
  const [productImages, setProductImages] = useState<string[]>([]);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [productDragOver, setProductDragOver] = useState(false);
  const [refDragOver, setRefDragOver] = useState(false);

  /* Warning dialog */
  const [showWarning, setShowWarning] = useState(false);
  const [exceededCount, setExceededCount] = useState(0);
  const [warningMax, setWarningMax] = useState(0);

  const MAX_PRODUCT = 8;
  const MAX_REF = 6;

  const resultsRef = useRef<HTMLDivElement>(null);
  const referenceCount = referenceImages.length;
  const canGenerate = productImages.length > 0 && referenceImages.length > 0;

  const handleGenerate = useCallback(() => {
    if (!canGenerate) return;
    setIsGenerating(true);
    setGeneratedCount(0);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedCount(referenceCount);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 3000);
  }, [canGenerate, referenceCount]);

  /* Drag & drop helpers */
  const handleFileDrop = (
    e: React.DragEvent,
    setDragOver: (v: boolean) => void,
    setImages: React.Dispatch<React.SetStateAction<string[]>>,
    maxFiles: number,
    currentCount: number,
  ) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/"),
    );
    const remaining = maxFiles - currentCount;

    if (files.length > remaining) {
      setExceededCount(files.length);
      setWarningMax(maxFiles);
      setShowWarning(true);
      if (remaining <= 0) return;
      files.splice(remaining);
    }

    files.forEach((f) => {
      const url = URL.createObjectURL(f);
      setImages((prev) => [...prev, url]);
    });
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImages: React.Dispatch<React.SetStateAction<string[]>>,
    maxFiles: number,
    currentCount: number,
  ) => {
    const files = Array.from(e.target.files ?? []).filter((f) =>
      f.type.startsWith("image/"),
    );
    const remaining = maxFiles - currentCount;

    if (files.length > remaining) {
      setExceededCount(files.length);
      setWarningMax(maxFiles);
      setShowWarning(true);
      if (remaining <= 0) {
        e.target.value = "";
        return;
      }
      files.splice(remaining);
    }

    files.forEach((f) => {
      const url = URL.createObjectURL(f);
      setImages((prev) => [...prev, url]);
    });
    e.target.value = "";
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <GlowOrb color="rgba(139, 92, 246, 0.12)" className="top-0 left-1/4" size={500} />
      <GlowOrb color="rgba(6, 182, 212, 0.08)" className="top-1/3 -right-20" size={400} />
      <GlowOrb color="rgba(139, 92, 246, 0.06)" className="-bottom-32 left-1/2" size={500} />

      <div className="fixed inset-0 bg-grid pointer-events-none" />

      {/* Warning dialog */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowWarning(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="w-[360px] p-6 rounded-2xl border border-white/[0.08] bg-[#0f0a2e]/95 backdrop-blur-2xl shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">上传数量超限</p>
                  <p className="text-xs text-muted">最多只能上传 {warningMax} 张图片</p>
                </div>
              </div>
              <p className="text-sm text-muted/80 mb-5 leading-relaxed">
                你选择了 {exceededCount} 张图片，但一次最多只能上传 {warningMax} 张。超出的图片已被自动忽略。
              </p>
              <button
                onClick={() => setShowWarning(false)}
                className="w-full py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-purple-accent to-cyber-blue hover:opacity-90 transition-opacity"
              >
                我知道了
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <div className="flex items-center gap-4 mb-3">
                <Link
                  href="/"
                  className="flex items-center gap-1.5 text-sm text-muted hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  返回首页
                </Link>
                <div className="w-px h-4 bg-white/[0.08]" />
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-accent to-cyber-blue flex items-center justify-center">
                    <Copy className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h1 className="text-xl font-semibold tracking-tight text-white">
                    AI 克隆图片
                  </h1>
                </div>
              </div>
              <p className="text-sm text-muted ml-[132px]">
                上传参考图，一键克隆风格
              </p>
            </motion.div>

            {/* ─── Main card ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-6 lg:p-8"
            >
              {/* 1. Model selector */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  选择模型
                </p>
                <ModelSelector selected={selectedModel} onSelect={setSelectedModel} />
              </div>

              {/* 2. PRO control panel */}
              <div className="mb-5 p-4 rounded-2xl border border-orange-400/20 bg-gradient-to-br from-orange-500/[0.06] via-amber-500/[0.04] to-orange-500/[0.02] backdrop-blur-xl relative">
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-orange-400/5 via-amber-500/3 to-transparent pointer-events-none" />
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

                {/* 3. Image count hint */}
                <div className="mb-4">
                  <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2.5">
                    生成张数
                  </p>
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                    <span className="text-sm text-white">
                      {referenceCount > 0
                        ? `将生成 ${referenceCount} 张`
                        : "等待上传参考图"}
                    </span>
                    <span className="text-xs text-muted/50">
                      克隆模式下，生成张数由参考图片数量决定
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-muted/50 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" />
                    上传几张参考图，就会生成几张图片
                  </p>
                </div>

                {/* 4. Aspect ratio */}
                <div>
                  <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2.5">
                    图片比例
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {aspectRatios.map((ratio) => {
                      const isActive = aspectRatio === ratio.id;
                      return (
                        <motion.button
                          key={ratio.id}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => setAspectRatio(ratio.id)}
                          className={`relative flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all duration-300 ${
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
                  <p className="mt-2 text-[11px] text-muted/50 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" />
                    克隆模式下，请尽量选择与参考图相同的画幅比例
                  </p>
                </div>
              </div>

              {/* 5. Product description (optional) */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  产品描述<span className="text-muted/40 font-normal ml-1">(可选)</span>
                </p>
                <div className="relative">
                  <input
                    type="text"
                    value={productFeatures}
                    onChange={(e) => setProductFeatures(e.target.value)}
                    placeholder="例如：防水防汗，轻薄透气"
                    className="w-full px-4 py-3 text-sm text-white placeholder-muted/30 bg-white/[0.03] border border-white/[0.08] rounded-xl focus:outline-none focus:border-purple-accent/50 focus:bg-white/[0.06] transition-all duration-200"
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-muted/50 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" />
                  不填则 AI 自动生成
                </p>
              </div>

              {/* 6. Visual style (optional) */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  画面风格<span className="text-muted/40 font-normal ml-1">(可选)</span>
                </p>
                <div className="relative">
                  <input
                    type="text"
                    value={visualStyle}
                    onChange={(e) => setVisualStyle(e.target.value)}
                    placeholder="赛博朋克、极简高级灰"
                    className="w-full px-4 py-3 text-sm text-white placeholder-muted/30 bg-white/[0.03] border border-white/[0.08] rounded-xl focus:outline-none focus:border-purple-accent/50 focus:bg-white/[0.06] transition-all duration-200"
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-muted/50 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" />
                  不填则 AI 自动生成
                </p>
              </div>

              {/* 7. Product title */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  产品标题
                </p>
                <input
                  type="text"
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  placeholder="例如：泡茶杯 三件式泡茶杯 玻璃泡茶杯 泡"
                  className="w-full px-4 py-3 text-sm text-white placeholder-muted/30 bg-white/[0.03] border border-white/[0.08] rounded-xl focus:outline-none focus:border-purple-accent/50 focus:bg-white/[0.06] transition-all duration-200"
                />
              </div>

              {/* 8. Output language */}
              <div className="mb-5">
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
              </div>

              {/* 9. Product image upload */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  商品图片上传<span className="text-muted/40 font-normal ml-1">(素材)</span>
                </p>
                <motion.div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setProductDragOver(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setProductDragOver(false);
                  }}
                  onDrop={(e) =>
                    handleFileDrop(e, setProductDragOver, setProductImages, MAX_PRODUCT, productImages.length)
                  }
                  className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer backdrop-blur-md ${
                    productDragOver
                      ? "border-purple-accent bg-purple-accent/[0.08] shadow-[0_0_40px_rgba(139,92,246,0.2)]"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04]"
                  } ${productImages.length > 0 ? "p-4" : "h-48"}`}
                >
                  {productImages.length === 0 ? (
                    <>
                      <motion.div
                        animate={
                          productDragOver ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }
                        }
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-colors duration-300 ${
                          productDragOver
                            ? "bg-purple-accent/20 text-purple-accent"
                            : "bg-white/[0.05] text-muted"
                        }`}
                      >
                        {productDragOver ? (
                          <ImageIcon className="w-5 h-5" />
                        ) : (
                          <Upload className="w-5 h-5" />
                        )}
                      </motion.div>
                      <p className="text-sm font-semibold text-white mb-1">
                        拖拽图片到此处或点击上传
                      </p>
                      <p className="text-xs text-muted">支持 JPG / PNG，最多 {MAX_PRODUCT} 张</p>
                    </>
                  ) : (
                    <div className="w-full relative z-10">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {productImages.map((src, i) => (
                          <div key={i} className="relative w-28 h-28 rounded-lg overflow-hidden border border-white/[0.08] group">
                            <img
                              src={src}
                              alt={`商品图 ${i + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setProductImages((prev) =>
                                  prev.filter((_, j) => j !== i),
                                );
                              }}
                              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center text-xs text-white hover:bg-red-500 transition-all duration-150 opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        {productImages.length < MAX_PRODUCT && (
                          <label className="w-28 h-28 rounded-lg border border-dashed border-white/[0.12] flex items-center justify-center text-muted/40 cursor-pointer hover:border-white/[0.25] hover:text-muted/60 transition-all duration-150">
                            <Upload className="w-6 h-6" />
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => handleFileSelect(e, setProductImages, MAX_PRODUCT, productImages.length)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                      <p className="text-xs text-muted/50">
                        {productImages.length}/{MAX_PRODUCT} 张 · 点击继续添加
                      </p>
                    </div>
                  )}
                  {productImages.length === 0 && (
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileSelect(e, setProductImages, MAX_PRODUCT, productImages.length)}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                  )}
                </motion.div>
                <div className="mt-2 flex items-start gap-1.5 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                  <Info className="w-3.5 h-3.5 text-purple-accent/60 shrink-0 mt-px" />
                  <p className="text-[11px] text-muted/70 leading-relaxed">
                    图片越清晰、角度越完整，效果越好
                  </p>
                </div>
              </div>

              {/* 10. Reference image upload */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  参考图片上传<span className="text-purple-accent font-normal ml-1">(用于复制构图)</span>
                </p>
                <motion.div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setRefDragOver(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setRefDragOver(false);
                  }}
                  onDrop={(e) =>
                    handleFileDrop(e, setRefDragOver, setReferenceImages, MAX_REF, referenceImages.length)
                  }
                  className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer backdrop-blur-md ${
                    refDragOver
                      ? "border-purple-accent bg-purple-accent/[0.08] shadow-[0_0_40px_rgba(139,92,246,0.2)]"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04]"
                  } ${referenceImages.length > 0 ? "p-4" : "h-48"}`}
                >
                  {referenceImages.length === 0 ? (
                    <>
                      <motion.div
                        animate={
                          refDragOver ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }
                        }
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-colors duration-300 ${
                          refDragOver
                            ? "bg-purple-accent/20 text-purple-accent"
                            : "bg-white/[0.05] text-muted"
                        }`}
                      >
                        {refDragOver ? (
                          <ImageIcon className="w-5 h-5" />
                        ) : (
                          <Upload className="w-5 h-5" />
                        )}
                      </motion.div>
                      <p className="text-sm font-semibold text-white mb-1">
                        拖拽参考图到此处或点击上传
                      </p>
                      <p className="text-xs text-muted">支持 JPG / PNG，最多 {MAX_REF} 张</p>
                    </>
                  ) : (
                    <div className="w-full relative z-10">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {referenceImages.map((src, i) => (
                          <div key={i} className="relative w-28 h-28 rounded-lg overflow-hidden border border-purple-accent/30 group">
                            <img
                              src={src}
                              alt={`参考图 ${i + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setReferenceImages((prev) =>
                                  prev.filter((_, j) => j !== i),
                                );
                              }}
                              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center text-xs text-white hover:bg-red-500 transition-all duration-150 opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        {referenceImages.length < MAX_REF && (
                          <label className="w-28 h-28 rounded-lg border border-dashed border-purple-accent/30 flex items-center justify-center text-purple-accent/40 cursor-pointer hover:border-purple-accent/50 hover:text-purple-accent/60 transition-all duration-150">
                            <Upload className="w-6 h-6" />
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => handleFileSelect(e, setReferenceImages, MAX_REF, referenceImages.length)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                      <p className="text-xs text-muted/50">
                        {referenceImages.length}/{MAX_REF} 张 · 点击继续添加
                      </p>
                    </div>
                  )}
                  {referenceImages.length === 0 && (
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileSelect(e, setReferenceImages, MAX_REF, referenceImages.length)}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                  )}
                </motion.div>
                <div className="mt-2 flex items-start gap-1.5 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                  <Info className="w-3.5 h-3.5 text-purple-accent/60 shrink-0 mt-px" />
                  <p className="text-[11px] text-muted/70 leading-relaxed">
                    ⚠️ 请勿上传与商品图片相同的参考图，否则无法生成有效结果
                  </p>
                </div>
              </div>

              {/* 11. Generate button */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.18, ease: "easeOut" }}
              >
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
                    whileHover={canGenerate ? { scale: 1.02 } : undefined}
                    whileTap={canGenerate ? { scale: 0.96 } : undefined}
                    onClick={handleGenerate}
                    disabled={!canGenerate || isGenerating}
                    className="w-full relative flex flex-col items-center py-5 rounded-2xl overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      boxShadow:
                        "0 0 60px rgba(249,115,22,0.3), 0 8px 32px rgba(249,115,22,0.2)",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 bg-[length:200%_100%] animate-shimmer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10" />
                    <span className="relative z-10 flex items-center gap-2.5 text-lg font-bold text-white tracking-wide">
                      <Crown className="w-5 h-5" />
                      {isGenerating
                        ? "生成中..."
                        : canGenerate
                          ? `生成 ${referenceCount} 张`
                          : "请先上传商品图和参考图"}
                    </span>
                  </motion.button>

                  {/* Credits cost */}
                  {canGenerate && (
                    <p className="text-center text-sm font-semibold text-amber-400/80 mt-3">
                      消耗 {referenceCount * 150} 积分
                    </p>
                  )}

                  {/* PRO guarantees */}
                  <p className="text-center text-xs text-muted/50 mt-2">
                    PRO 专属提示词 · 按张计费 · 失败自动退币
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* ─── Results ─── */}
            <motion.div
              ref={resultsRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
              className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md overflow-hidden min-h-[320px]"
            >
              {isGenerating ? (
                /* Skeleton loading */
                <div className="p-6">
                  <h2 className="text-sm font-semibold text-white mb-4">生成中...</h2>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {Array.from({ length: referenceCount || 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded-xl bg-white/[0.03] border border-white/[0.04] overflow-hidden"
                      >
                        <div className="absolute inset-0 skeleton-shimmer" />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center mt-4">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/[0.06]">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-accent" />
                      </motion.div>
                      <span className="text-xs font-medium text-muted">AI 生成中...</span>
                    </div>
                  </div>
                </div>
              ) : generatedCount > 0 ? (
                /* Results grid */
                <div className="p-6">
                  <h2 className="text-sm font-semibold text-white mb-4">
                    生成结果 ({generatedCount} 张)
                  </h2>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {Array.from({ length: generatedCount }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05, duration: 0.3, ease: "easeOut" }}
                        className={`relative rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer group ${
                          i === 0
                            ? "border-purple-accent/40 glow-ring md:col-span-2 md:row-span-2"
                            : "border-white/[0.06] hover:border-white/[0.14]"
                        } bg-gradient-to-br from-[#0f0a2e] via-[#0c0824] to-[#0a1628]`}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-muted/30 group-hover:text-purple-accent/40 transition-colors" />
                        </div>
                        {i === 0 && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-purple-accent/80 text-[10px] font-semibold text-white z-10">
                            主图
                          </div>
                        )}
                        <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Empty state */
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.04] flex items-center justify-center">
                    <ImageIcon className="w-7 h-7 text-muted/40" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted font-medium mb-1">暂无生成结果</p>
                    <p className="text-xs text-muted/50">
                      上传商品图和参考图后开始生成
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-4">
              <button
                disabled={isGenerating || generatedCount === 0}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-purple-accent to-cyber-blue hover:opacity-90 transition-all duration-300 shadow-lg shadow-purple-accent/20 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.02]"
              >
                <Download className="w-4 h-4" />
                下载全部 (HD)
              </button>
              <button
                disabled={isGenerating || generatedCount === 0}
                className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-muted hover:text-white rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.14] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.02]"
              >
                <Maximize2 className="w-4 h-4" />
                放大 4K
              </button>
            </div>
          </div>
        </main>
      </div>
      <ScrollToTop />
    </div>
  );
}
