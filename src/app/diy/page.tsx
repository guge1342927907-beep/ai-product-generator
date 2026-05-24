"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Info,
  X,
  AlertTriangle,
  Star,
  ChevronDown,
  Wand2,
  Download,
  Maximize2,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { GlowOrb } from "@/components/GlowOrb";
import { Sidebar } from "@/components/Sidebar";
import { models } from "@/components/ModelSelector";
import { ScrollToTop } from "@/components/ScrollToTop";

/* ─── Data ─── */

const diyModels = models.filter((m) => m.id !== "banana-lite");

const aspectRatios = [
  { id: "1:1", label: "1:1", desc: "正方形" },
  { id: "3:2", label: "3:2", desc: "经典" },
  { id: "2:3", label: "2:3", desc: "竖版" },
  { id: "4:3", label: "4:3", desc: "横版" },
  { id: "3:4", label: "3:4", desc: "竖版" },
  { id: "16:9", label: "16:9", desc: "宽屏" },
  { id: "9:16", label: "9:16", desc: "竖屏" },
];

const MAX_REF = 8;
const MAX_PROMPT = 10000;

const aspectRatioSizeMap: Record<string, { maxWidth: string; aspect: string }> = {
  "1:1":  { maxWidth: "max-w-md",  aspect: "aspect-square" },
  "3:2":  { maxWidth: "max-w-lg",  aspect: "aspect-[3/2]" },
  "2:3":  { maxWidth: "max-w-xs",  aspect: "aspect-[2/3]" },
  "4:3":  { maxWidth: "max-w-lg",  aspect: "aspect-[4/3]" },
  "3:4":  { maxWidth: "max-w-sm",  aspect: "aspect-[3/4]" },
  "16:9": { maxWidth: "max-w-xl",  aspect: "aspect-[16/9]" },
  "9:16": { maxWidth: "max-w-xs",  aspect: "aspect-[9/16]" },
};

/* ─── Component ─── */

export default function DiyPage() {
  const [selectedModel, setSelectedModel] = useState(diyModels[0]);
  const [modelOpen, setModelOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [refDragOver, setRefDragOver] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [exceededCount, setExceededCount] = useState(0);
  const [promptFocused, setPromptFocused] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);
  const canGenerate = prompt.trim().length >= 5;

  const handleGenerate = useCallback(() => {
    if (!canGenerate) return;
    setIsGenerating(true);
    setGeneratedCount(0);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedCount(1);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 3000);
  }, [canGenerate]);

  /* Upload helpers */
  const processRefFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files).filter((f) =>
        f.type.startsWith("image/")
      );
      const remaining = MAX_REF - referenceImages.length;

      if (fileArray.length > remaining) {
        setExceededCount(fileArray.length);
        setShowWarning(true);
        if (remaining <= 0) return;
        fileArray.splice(remaining);
      }

      const newUrls = fileArray.map((f) => URL.createObjectURL(f));
      setReferenceImages((prev) => [...prev, ...newUrls]);
    },
    [referenceImages.length]
  );

  const removeRefImage = useCallback((index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setReferenceImages((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[index]);
      next.splice(index, 1);
      return next;
    });
  }, []);

  const handleRefDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setRefDragOver(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processRefFiles(e.dataTransfer.files);
      }
    },
    [processRefFiles]
  );

  const handleRefFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processRefFiles(e.target.files);
      }
      e.target.value = "";
    },
    [processRefFiles]
  );

  return (
    <div className="relative min-h-screen overflow-hidden">
      <GlowOrb color="rgba(139, 92, 246, 0.14)" className="top-0 left-1/4" size={500} />
      <GlowOrb color="rgba(6, 182, 212, 0.08)" className="top-1/3 -right-20" size={400} />
      <GlowOrb color="rgba(139, 92, 246, 0.08)" className="-bottom-32 left-1/2" size={500} />

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
                  <p className="text-xs text-muted">最多只能上传 {MAX_REF} 张图片</p>
                </div>
              </div>
              <p className="text-sm text-muted/80 mb-5 leading-relaxed">
                你选择了 {exceededCount} 张图片，但一次最多只能上传 {MAX_REF} 张。超出的图片已被自动忽略。
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
                    <Wand2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h1 className="text-xl font-semibold tracking-tight text-white">
                    DIY 自由生图
                  </h1>
                </div>
              </div>
              <p className="text-sm text-muted ml-[132px]">
                输入创意描述，AI 为你生成图片
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
                <div className="relative">
                  {/* Trigger */}
                  <button
                    onClick={() => setModelOpen(!modelOpen)}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all duration-300 ${
                      modelOpen
                        ? "border-purple-accent/40 bg-white/[0.06] glow-ring"
                        : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.16] hover:bg-white/[0.05]"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedModel.color} flex items-center justify-center shadow-lg shrink-0`}
                      style={{ opacity: 0.9 }}
                    >
                      <selectedModel.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-white">{selectedModel.label}</p>
                        {selectedModel.badge && (
                          <span className="px-1.5 py-0.5 rounded-md bg-purple-accent/20 text-[10px] font-bold text-purple-accent border border-purple-accent/25">
                            {selectedModel.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted truncate">{selectedModel.desc}</p>
                    </div>
                    <motion.div
                      animate={{ rotate: modelOpen ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-colors duration-200 ${
                          modelOpen ? "text-purple-accent" : "text-muted/50"
                        }`}
                      />
                    </motion.div>
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {modelOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -12, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="absolute inset-x-0 top-full mt-2.5 p-2 rounded-2xl border border-white/[0.1] bg-[#0f0a2e]/95 backdrop-blur-2xl shadow-2xl shadow-purple-accent/10 z-20"
                      >
                        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-b from-purple-accent/5 to-transparent pointer-events-none" />
                        <div className="relative flex flex-col gap-1">
                          {diyModels.map((model) => {
                            const isSelected = selectedModel.id === model.id;
                            return (
                              <motion.button
                                key={model.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => {
                                  setSelectedModel(model);
                                  setModelOpen(false);
                                }}
                                className={`relative flex items-center gap-4 px-3.5 py-3 rounded-xl text-left transition-all duration-200 group ${
                                  isSelected
                                    ? "text-white"
                                    : "text-muted hover:text-white hover:bg-white/[0.05]"
                                }`}
                              >
                                {isSelected && (
                                  <motion.div
                                    layoutId="diy-model-bg"
                                    className={`absolute inset-0 rounded-xl bg-gradient-to-r ${model.color} opacity-15`}
                                    transition={{
                                      type: "spring",
                                      bounce: 0.15,
                                      duration: 0.45,
                                    }}
                                  />
                                )}
                                {isSelected && (
                                  <motion.div
                                    layoutId="diy-model-ring"
                                    className="absolute inset-0 rounded-xl ring-1 ring-inset ring-purple-accent/50"
                                    transition={{
                                      type: "spring",
                                      bounce: 0.15,
                                      duration: 0.45,
                                    }}
                                  />
                                )}
                                <div
                                  className={`relative z-10 w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${
                                    isSelected
                                      ? `bg-gradient-to-br ${model.color} opacity-90 shadow-lg`
                                      : "bg-white/[0.06] group-hover:bg-white/[0.1]"
                                  }`}
                                >
                                  <model.icon
                                    className={`w-4 h-4 ${isSelected ? "text-white" : "text-muted/40 group-hover:text-muted/70"}`}
                                  />
                                </div>
                                <div className="relative z-10 flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold">{model.label}</p>
                                    {model.badge && (
                                      <span
                                        className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold border ${
                                          isSelected
                                            ? "bg-purple-accent/20 text-purple-accent border-purple-accent/30"
                                            : "bg-white/[0.04] text-muted/60 border-white/[0.06]"
                                        }`}
                                      >
                                        {model.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted/50 mt-0.5">{model.desc}</p>
                                </div>
                                {isSelected && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.1, type: "spring", bounce: 0.4, duration: 0.4 }}
                                    className="relative z-10 w-5 h-5 rounded-full bg-purple-accent/20 flex items-center justify-center"
                                  >
                                    <Star className="w-2.5 h-2.5 text-purple-accent fill-purple-accent" />
                                  </motion.div>
                                )}
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* 2. Prompt (main area) */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  提示词
                </p>
                <motion.div
                  animate={
                    promptFocused
                      ? { scale: 1.005 }
                      : { scale: 1 }
                  }
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className={`relative rounded-xl transition-all duration-300 ${
                    promptFocused
                      ? "shadow-[0_0_32px_rgba(139,92,246,0.18),0_0_0_1px_rgba(139,92,246,0.4)]"
                      : "shadow-none"
                  }`}
                >
                  {/* Focus gradient ring */}
                  <div
                    className={`absolute -inset-[1px] rounded-xl bg-gradient-to-r from-purple-accent/60 via-cyber-blue/40 to-purple-accent/60 opacity-0 transition-opacity duration-300 pointer-events-none ${
                      promptFocused ? "opacity-100" : ""
                    }`}
                  />
                  <textarea
                    value={prompt}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.length <= MAX_PROMPT) setPrompt(val);
                    }}
                    onFocus={() => setPromptFocused(true)}
                    onBlur={() => setPromptFocused(false)}
                    placeholder="描述你想要生成的图片，例如：一只穿着宇航服的猫在月球上漫步，背景是蓝色的地球，电影级画质。越详细的效果越好..."
                    rows={8}
                    className="relative w-full px-4 py-4 pr-16 text-sm text-white placeholder-muted/30 bg-white/[0.03] border border-white/[0.08] rounded-xl focus:outline-none focus:bg-white/[0.06] transition-all duration-300 resize-none"
                  />
                  {/* Char count */}
                  <motion.span
                    key={prompt.length}
                    initial={{ scale: 1.2, opacity: 0.6 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute right-3.5 bottom-3.5 text-[11px] font-medium tabular-nums transition-colors duration-300 ${
                      prompt.length >= MAX_PROMPT * 0.95
                        ? "text-red-400/80"
                        : prompt.length >= MAX_PROMPT * 0.8
                          ? "text-amber-400/70"
                          : "text-muted/40"
                    }`}
                  >
                    {prompt.length}/{MAX_PROMPT}
                  </motion.span>
                </motion.div>

                {/* Min-length warning */}
                <AnimatePresence>
                  {prompt.trim().length > 0 && prompt.trim().length < 5 && (
                    <motion.p
                      initial={{ opacity: 0, y: -4, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -4, height: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="flex items-center gap-1.5 mt-2 text-xs text-amber-400/90 overflow-hidden"
                    >
                      <span className="w-1 h-1 rounded-full bg-amber-400/80" />
                      至少 5 个字符
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* 3. Aspect ratio */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
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
                        className={`relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl border transition-all duration-300 ${
                          isActive
                            ? "border-purple-accent/50 bg-gradient-to-b from-purple-accent/20 to-cyber-blue/10 shadow-[0_0_16px_rgba(139,92,246,0.15)]"
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
                            isActive ? "text-purple-accent/60" : "text-muted/30"
                          }`}
                        >
                          {ratio.desc}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Reference image upload (optional) */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  参考图片<span className="text-muted/40 font-normal ml-1">(可选，最多 {MAX_REF} 张)</span>
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
                  onDrop={handleRefDrop}
                  className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 backdrop-blur-md ${
                    refDragOver
                      ? "border-purple-accent bg-purple-accent/[0.08] shadow-[0_0_40px_rgba(139,92,246,0.2)]"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04]"
                  } ${referenceImages.length > 0 ? "p-4" : "flex flex-col items-center justify-center h-40 cursor-pointer"}`}
                >
                  {referenceImages.length === 0 ? (
                    <>
                      <motion.div
                        animate={refDragOver ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
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
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleRefFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                    </>
                  ) : (
                    <div className="w-full relative z-10">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {referenceImages.map((src, i) => (
                          <div
                            key={src}
                            className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/[0.08] group"
                          >
                            <img
                              src={src}
                              alt={`参考图 ${i + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={(e) => removeRefImage(i, e)}
                              className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500/80 flex items-center justify-center text-white hover:bg-red-500 transition-all duration-150 opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        {referenceImages.length < MAX_REF && (
                          <label className="w-20 h-20 rounded-lg border border-dashed border-white/[0.12] flex items-center justify-center text-muted/40 cursor-pointer hover:border-white/[0.25] hover:text-muted/60 transition-all duration-150">
                            <Upload className="w-5 h-5" />
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleRefFileChange}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                      <div className="flex items-start gap-1.5">
                        <Info className="w-3.5 h-3.5 text-purple-accent/60 shrink-0 mt-px" />
                        <p className="text-[11px] text-muted/70 leading-relaxed">
                          参考图将作为 AI 生成的风格与构图参考 · 已上传 {referenceImages.length}/{MAX_REF} 张
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
                <p className="mt-2 text-[11px] text-muted/50 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" />
                  未上传参考图时，默认文生图模式，AI 将直接根据提示词出图
                </p>
              </div>

              {/* 5. Bottom bar: credits + generate button */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
                className="flex items-center justify-between gap-6 pt-4 border-t border-white/[0.06]"
              >
                {/* Credits info */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-sm">
                    <span className="text-muted">费用：</span>
                    <span className="font-semibold text-white">100 积分</span>
                  </div>
                  <div className="w-px h-3 bg-white/[0.1]" />
                  <div className="flex items-center gap-1.5 text-sm">
                    <span className="text-muted">余额：</span>
                    <span className="font-semibold text-muted/60">0</span>
                  </div>
                </div>

                {/* Generate button */}
                <motion.button
                  whileHover={canGenerate ? { scale: 1.02 } : undefined}
                  whileTap={canGenerate ? { scale: 0.96 } : undefined}
                  onClick={handleGenerate}
                  disabled={!canGenerate || isGenerating}
                  className="relative flex items-center gap-2.5 px-8 py-3.5 text-base font-semibold text-white rounded-2xl overflow-hidden shadow-2xl shadow-purple-accent/25 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-accent via-cyber-blue to-purple-accent bg-[length:200%_100%] animate-shimmer" />
                  <span className="relative z-10 flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5" />
                    {isGenerating ? "生成中..." : "开始生成"}
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>

            {/* ─── Results ─── */}
            <motion.div
              ref={resultsRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
              className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md overflow-hidden"
            >
              {isGenerating ? (
                /* Skeleton loading */
                <div className="p-4 flex flex-col items-center">
                  <h2 className="text-sm font-semibold text-white mb-3 self-start">生成中...</h2>
                  <div className={`w-full ${aspectRatioSizeMap[aspectRatio]?.maxWidth ?? "max-w-md"}`}>
                    <div className={`relative w-full ${aspectRatioSizeMap[aspectRatio]?.aspect ?? "aspect-square"} rounded-xl bg-white/[0.03] border border-white/[0.04] overflow-hidden`}>
                      <div className="absolute inset-0 skeleton-shimmer" />
                    </div>
                  </div>
                  <div className="flex items-center justify-center mt-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/[0.06]">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-3 h-3 text-purple-accent" />
                      </motion.div>
                      <span className="text-xs font-medium text-muted">AI 生成中...</span>
                    </div>
                  </div>
                </div>
              ) : generatedCount > 0 ? (
                /* Result — single image sized to aspect ratio */
                <div className="p-4 flex flex-col items-center">
                  <h2 className="text-sm font-semibold text-white mb-3 self-start">
                    生成结果
                  </h2>
                  <div className={`w-full ${aspectRatioSizeMap[aspectRatio]?.maxWidth ?? "max-w-md"}`}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className={`relative w-full ${aspectRatioSizeMap[aspectRatio]?.aspect ?? "aspect-square"} rounded-xl overflow-hidden border border-purple-accent/40 glow-ring cursor-pointer group bg-gradient-to-br from-[#0f0a2e] via-[#0c0824] to-[#0a1628]`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-muted/30 group-hover:text-purple-accent/40 transition-colors" />
                      </div>
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-purple-accent/80 text-[10px] font-semibold text-white z-10">
                        {aspectRatio}
                      </div>
                      <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  </div>
                </div>
              ) : (
                /* Empty state */
                <div className="flex flex-col items-center justify-center gap-3 py-12">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.04] flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-muted/40" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted font-medium">暂无生成结果</p>
                    <p className="text-xs text-muted/50 mt-0.5">
                      输入提示词后开始生成
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
                下载 (HD)
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
