"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  Upload,
  Image as ImageIcon,
  X,
  AlertTriangle,
  Video,
  Play,
  Clock,
  Monitor,
  Lightbulb,
  ChevronDown,
  Star,
  Film,
  Zap,
  Volume2,
  VolumeX,
  ImagePlus,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { GlowOrb } from "@/components/GlowOrb";
import { Sidebar } from "@/components/Sidebar";
import { ScrollToTop } from "@/components/ScrollToTop";

/* ─── Data ─── */

interface VideoModel {
  id: string;
  label: string;
  icon: typeof Video;
  color: string;
}

const videoModels: VideoModel[] = [
  {
    id: "sora-2-pro",
    label: "Sora 2 Pro",
    icon: Film,
    color: "from-purple-accent to-cyber-blue",
  },
  {
    id: "seedance-2",
    label: "Seedance 2.0",
    icon: Zap,
    color: "from-amber-500 to-orange-500",
  },
];

const examplePrompts = [
  {
    title: "做产品宣传视频...",
    prompt:
      "产品放在旋转展台上，镜头环绕拍摄，灯光聚焦在产品表面，背景为纯黑，电影级布光，4K 画质，慢动作",
  },
  {
    title: "抖音产品宣传视频...",
    prompt:
      "竖屏拍摄，产品从画面底部升起，背景为渐变色，快节奏剪辑，配合文字弹出动画，适合抖音短视频",
  },
  {
    title: "运动鞋在空中翻转...",
    prompt:
      "一双运动鞋在空中慢动作翻转，水花四溅，地面为反光材质，霓虹灯光，赛博朋克风格，超现实主义",
  },
];

const steps = [
  {
    icon: Upload,
    title: "上传参考图",
    desc: "上传产品图或风格参考图，AI 将以此为参考生成视频画面",
  },
  {
    icon: Film,
    title: "描述画面",
    desc: "用文字详细描述你想要的视频内容、运镜方式和画面风格",
  },
  {
    icon: Play,
    title: "生成视频",
    desc: "点击生成，等待约 2-5 分钟，即可获得高质量 720p 视频",
  },
];

/* Sora params */
const soraRatios = [
  { id: "9:16", label: "9:16", desc: "竖屏" },
  { id: "16:9", label: "16:9", desc: "宽屏" },
];

const soraDurations = [
  { seconds: 4, credits: 164 },
  { seconds: 8, credits: 328 },
  { seconds: 12, credits: 492 },
];

/* Seedance params */
const seedanceGenTypes = [
  { id: "text-to-video", label: "文生视频", icon: Film },
  { id: "first-frame", label: "首帧", icon: ImageIcon },
  { id: "first-last-frame", label: "首尾帧", icon: Layers },
  { id: "multi-ref", label: "多图参考", icon: ImagePlus },
];

const seedanceVariants = [
  { id: "doubao-fast", label: "Doubao-Seedance-2.0-Fast" },
  { id: "doubao-pro", label: "Doubao-Seedance-2.0" },
];

const seedanceRatios = [
  { id: "9:16", label: "9:16" },
  { id: "16:9", label: "16:9" },
  { id: "1:1", label: "1:1" },
  { id: "4:3", label: "4:3" },
  { id: "3:4", label: "3:4" },
  { id: "21:9", label: "21:9" },
  { id: "auto", label: "自动" },
];

const seedanceDurations = [
  { seconds: 4, credits: 680 },
  { seconds: 5, credits: 850 },
  { seconds: 6, credits: 1020 },
  { seconds: 8, credits: 1360 },
  { seconds: 10, credits: 1700 },
  { seconds: 12, credits: 2040 },
  { seconds: 15, credits: 2550 },
  { seconds: 0, credits: 0, label: "Auto" },
];

const maxRefByGenType: Record<string, number> = {
  "text-to-video": 0,
  "first-frame": 1,
  "first-last-frame": 2,
  "multi-ref": 9,
};

/* ─── Helpers ─── */

const isSora = (model: VideoModel) => model.id === "sora-2-pro";
const isSeedance = (model: VideoModel) => model.id === "seedance-2";

function getCredits(model: VideoModel, duration: number): number {
  const list = isSora(model) ? soraDurations : seedanceDurations;
  return list.find((d) => d.seconds === duration)?.credits ?? 0;
}

/* ─── Component ─── */

export default function VideoPage() {
  const [selectedModel, setSelectedModel] = useState(videoModels[0]);
  const [modelOpen, setModelOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [refDragOver, setRefDragOver] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMsg, setWarningMsg] = useState("");

  /* Sora params */
  const [soraRatio, setSoraRatio] = useState("9:16");
  const [soraDuration, setSoraDuration] = useState(12);

  /* Seedance params */
  const [seedanceGenType, setSeedanceGenType] = useState("text-to-video");
  const [seedanceVariant, setSeedanceVariant] = useState(seedanceVariants[0]);
  const [seedanceVariantOpen, setSeedanceVariantOpen] = useState(false);
  const [seedanceRatio, setSeedanceRatio] = useState("9:16");
  const [seedanceRatioOpen, setSeedanceRatioOpen] = useState(false);
  const [seedanceDuration, setSeedanceDuration] = useState(12);
  const [seedanceDurationOpen, setSeedanceDurationOpen] = useState(false);
  const [seedanceAudio, setSeedanceAudio] = useState(true);

  /* Sora duration dropdown */
  const [soraDurationOpen, setSoraDurationOpen] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  const maxRef = isSeedance(selectedModel)
    ? (maxRefByGenType[seedanceGenType] ?? 6)
    : 1;
  const maxFileMB = 4;
  const needsImage = isSeedance(selectedModel) && seedanceGenType !== "text-to-video";
  const canGenerate = prompt.trim().length >= 9 && (!needsImage || referenceImages.length > 0);

  const handleGenerate = useCallback(() => {
    if (!canGenerate) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 4000);
  }, [canGenerate]);

  const handleModelChange = (model: VideoModel) => {
    setSelectedModel(model);
    setModelOpen(false);
    setReferenceImages([]);
  };

  const handleGenTypeChange = (gt: string) => {
    setSeedanceGenType(gt);
    setReferenceImages([]);
  };

  /* Upload helpers */
  const processRefFiles = useCallback(
    (files: FileList | File[]) => {
      const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));

      for (const f of imageFiles) {
        if (f.size > maxFileMB * 1024 * 1024) {
          setWarningMsg(`图片 "${f.name}" 大小为 ${Math.round(f.size / 1024 / 1024)}MB，超过 ${maxFileMB}MB 限制`);
          setShowWarning(true);
          return;
        }
      }

      const remaining = maxRef - referenceImages.length;

      if (imageFiles.length > remaining) {
        setWarningMsg(`最多只能上传 ${maxRef} 张图片，超出的图片已被自动忽略`);
        setShowWarning(true);
        if (remaining <= 0) return;
        imageFiles.splice(remaining);
      }

      const newUrls = imageFiles.map((f) => URL.createObjectURL(f));
      setReferenceImages((prev) => [...prev, ...newUrls]);
    },
    [referenceImages.length, maxRef]
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

  const currentCredits = getCredits(
    selectedModel,
    isSora(selectedModel) ? soraDuration : seedanceDuration
  );

  const accentBorder = isSeedance(selectedModel)
    ? "border-orange-400/50"
    : "border-purple-accent/50";
  const accentBg = isSeedance(selectedModel)
    ? "from-orange-500/20 to-amber-500/10"
    : "from-purple-accent/20 to-cyber-blue/10";
  const accentGlow = isSeedance(selectedModel)
    ? "shadow-[0_0_16px_rgba(249,115,22,0.15)]"
    : "shadow-[0_0_16px_rgba(139,92,246,0.12)]";

  /* ─── Render Seedance upload center (gen-type-specific) ─── */
  function renderSeedanceUploadCenter() {
    switch (seedanceGenType) {
      case "text-to-video":
        return (
          <div className="flex flex-col items-center justify-center h-full text-muted/40">
            <Film className="w-8 h-8 mb-2" />
            <span className="text-sm font-medium">纯文本</span>
            <span className="text-[11px] mt-0.5">直接根据提示词生成视频</span>
          </div>
        );

      case "first-frame":
        return (
          <label className="flex flex-col items-center justify-center h-full cursor-pointer rounded-xl border-2 border-dashed border-white/[0.1] hover:border-purple-accent/50 hover:bg-white/[0.04] transition-all duration-300">
            <ImageIcon className="w-8 h-8 text-muted/40 mb-2" />
            <span className="text-sm font-medium text-muted">点击上传首帧</span>
            <input type="file" accept="image/*" onChange={handleRefFileChange} className="hidden" />
          </label>
        );

      case "first-last-frame":
        return (
          <div className="flex gap-3 h-full">
            <label className="flex-1 flex flex-col items-center justify-center cursor-pointer rounded-xl border-2 border-dashed border-white/[0.1] hover:border-purple-accent/50 hover:bg-white/[0.04] transition-all duration-300">
              <ImageIcon className="w-7 h-7 text-muted/40 mb-1.5" />
              <span className="text-xs font-medium text-muted">首帧</span>
              <span className="text-[10px] text-muted/40 mt-0.5">点击上传</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleRefFileChange}
                className="hidden"
              />
            </label>
            <label className="flex-1 flex flex-col items-center justify-center cursor-pointer rounded-xl border-2 border-dashed border-white/[0.1] hover:border-purple-accent/50 hover:bg-white/[0.04] transition-all duration-300">
              <ImageIcon className="w-7 h-7 text-muted/40 mb-1.5" />
              <span className="text-xs font-medium text-muted">尾帧</span>
              <span className="text-[10px] text-muted/40 mt-0.5">点击上传</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleRefFileChange}
                className="hidden"
              />
            </label>
          </div>
        );

      case "multi-ref":
        return (
          <div className="grid grid-cols-3 gap-1.5 h-full content-center">
            {Array.from({ length: 9 }).map((_, i) =>
              i === 0 ? (
                <label
                  key={i}
                  className="aspect-square rounded-lg border-2 border-dashed border-white/[0.12] flex items-center justify-center cursor-pointer hover:border-purple-accent/50 hover:bg-white/[0.04] transition-all duration-200"
                >
                  <Upload className="w-4 h-4 text-muted/40" />
                  <input type="file" accept="image/*" multiple onChange={handleRefFileChange} className="hidden" />
                </label>
              ) : (
                <div
                  key={i}
                  className="aspect-square rounded-lg border border-dashed border-white/[0.04] bg-white/[0.01]"
                />
              )
            )}
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <GlowOrb color="rgba(139, 92, 246, 0.14)" className="top-0 left-1/4" size={500} />
      <GlowOrb color="rgba(6, 182, 212, 0.08)" className="top-1/3 -right-20" size={400} />
      <GlowOrb color="rgba(139, 92, 246, 0.08)" className="-bottom-32 left-1/2" size={500} />
      {isSeedance(selectedModel) && (
        <GlowOrb color="rgba(249, 115, 22, 0.06)" className="top-1/2 left-1/3" size={350} />
      )}

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
                  <p className="text-sm font-bold text-white">上传提示</p>
                  <p className="text-xs text-muted">最多上传 {maxRef} 张 · 单张不超过 {maxFileMB}MB</p>
                </div>
              </div>
              <p className="text-sm text-muted/80 mb-5 leading-relaxed">{warningMsg}</p>
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
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${selectedModel.color} flex items-center justify-center shadow-md shadow-purple-accent/25`}>
                    <Video className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h1 className="text-xl font-semibold tracking-tight text-white">
                    AI 视频生成
                  </h1>
                </div>
              </div>
              <p className="text-sm text-muted ml-[132px]">
                {isSora(selectedModel)
                  ? "上传参考图并描述你想要的视频画面，Sora 2 将为你生成高质量 720p 视频"
                  : "Seedance 2.0 · 多种生成方式 · 精确控制首尾帧 · 快速出片"}
              </p>
            </motion.div>

            {/* ─── Main card ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-6 lg:p-8"
            >
              {/* 1. Model selector — always visible */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  选择模型
                </p>
                <div className="relative">
                  <button
                    onClick={() => setModelOpen(!modelOpen)}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all duration-300 ${
                      modelOpen
                        ? isSeedance(selectedModel)
                          ? "border-orange-400/40 bg-white/[0.06]"
                          : "border-purple-accent/40 bg-white/[0.06] glow-ring"
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
                      <p className="text-sm font-semibold text-white">{selectedModel.label}</p>
                    </div>
                    <motion.div
                      animate={{ rotate: modelOpen ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-colors duration-200 ${
                          modelOpen
                            ? isSeedance(selectedModel)
                              ? "text-amber-400"
                              : "text-purple-accent"
                            : "text-muted/50"
                        }`}
                      />
                    </motion.div>
                  </button>

                  {/* Model dropdown */}
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
                          {videoModels.map((model) => {
                            const isSelected = selectedModel.id === model.id;
                            return (
                              <motion.button
                                key={model.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleModelChange(model)}
                                className={`relative flex items-center gap-4 px-3.5 py-3 rounded-xl text-left transition-all duration-200 group ${
                                  isSelected ? "text-white" : "text-muted hover:text-white hover:bg-white/[0.05]"
                                }`}
                              >
                                {isSelected && (
                                  <motion.div
                                    layoutId="video-model-bg"
                                    className={`absolute inset-0 rounded-xl bg-gradient-to-r ${model.color} opacity-15`}
                                    transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
                                  />
                                )}
                                {isSelected && (
                                  <motion.div
                                    layoutId="video-model-ring"
                                    className="absolute inset-0 rounded-xl ring-1 ring-inset ring-purple-accent/50"
                                    transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
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
                                  <p className="text-sm font-semibold">{model.label}</p>
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

              {/* ─── Model-specific content ─── */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedModel.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {isSora(selectedModel) ? (
                    /* ═══════ Sora 2 Pro ═══════ */
                    <>
                      {/* Prompt + Reference merged row */}
                      <div className="flex gap-5 mb-5">
                        {/* Left: Reference upload */}
                        <div className="w-[200px] shrink-0">
                          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">参考图片</p>
                          <motion.div
                            onDragOver={(e) => { e.preventDefault(); setRefDragOver(true); }}
                            onDragLeave={(e) => { e.preventDefault(); setRefDragOver(false); }}
                            onDrop={handleRefDrop}
                            className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 backdrop-blur-md overflow-hidden ${
                              refDragOver
                                ? "border-purple-accent bg-purple-accent/[0.08] shadow-[0_0_40px_rgba(139,92,246,0.2)]"
                                : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04]"
                            }`}
                            style={{ height: referenceImages.length > 0 ? "auto" : "180px" }}
                          >
                            {referenceImages.length === 0 ? (
                              <label className="flex flex-col items-center justify-center h-full cursor-pointer">
                                <Upload className="w-7 h-7 text-muted/40 mb-2" />
                                <span className="text-sm font-medium text-muted">上传参考图</span>
                                <span className="text-[10px] text-muted/40 mt-0.5">JPG / PNG · ≤ {maxFileMB}MB</span>
                                <input type="file" accept="image/*" onChange={handleRefFileChange} className="hidden" />
                              </label>
                            ) : (
                              <div className="p-3">
                                <div className="flex flex-wrap gap-2">
                                  {referenceImages.map((src, i) => (
                                    <div key={src} className="relative w-full aspect-square rounded-lg overflow-hidden border border-white/[0.08] group">
                                      <img src={src} alt={`参考图 ${i + 1}`} className="w-full h-full object-cover" />
                                      <button
                                        onClick={(e) => removeRefImage(i, e)}
                                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center text-white hover:bg-red-500 transition-all duration-150 opacity-0 group-hover:opacity-100"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        </div>

                        {/* Right: Prompt */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">提示词</p>
                          <div className="relative">
                            <textarea
                              value={prompt}
                              onChange={(e) => setPrompt(e.target.value)}
                              placeholder="描述视频内容，避免出现真人或受版权保护的 IP 形象。例如：一个精致的咖啡杯放在木质桌面上，阳光透过窗户洒在杯口，蒸汽缓缓升起..."
                              rows={7}
                              className="w-full px-4 py-4 pr-16 text-sm text-white placeholder-muted/30 bg-white/[0.03] border border-white/[0.08] rounded-xl focus:outline-none focus:border-purple-accent/50 focus:bg-white/[0.06] focus:shadow-[0_0_24px_rgba(139,92,246,0.1)] transition-all duration-300 resize-none"
                            />
                            <span className="absolute right-3.5 bottom-3.5 text-[11px] text-muted/40">{prompt.length}/5000</span>
                          </div>
                          <AnimatePresence>
                            {prompt.trim().length > 0 && prompt.trim().length < 9 && (
                              <motion.p
                                initial={{ opacity: 0, y: -4, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                exit={{ opacity: 0, y: -4, height: 0 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="flex items-center gap-1.5 mt-2 text-xs text-amber-400/90 overflow-hidden"
                              >
                                <span className="w-1 h-1 rounded-full bg-amber-400/80" />
                                至少 9 个字符
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Video params (compact) */}
                      <div className="flex items-center gap-3 mb-6 p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                        <span className="text-[11px] font-medium text-muted shrink-0 flex items-center gap-1">
                          <Monitor className="w-3 h-3" />画幅
                        </span>
                        <div className="flex gap-1">
                          {soraRatios.map((ratio) => {
                            const isActive = soraRatio === ratio.id;
                            return (
                              <motion.button
                                key={ratio.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setSoraRatio(ratio.id)}
                                className={`relative flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs transition-all duration-300 ${
                                  isActive
                                    ? "border-purple-accent/50 bg-gradient-to-b from-purple-accent/20 to-cyber-blue/10 shadow-[0_0_16px_rgba(139,92,246,0.12)]"
                                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04]"
                                }`}
                              >
                                <span className={`font-bold ${isActive ? "text-white" : "text-muted"}`}>{ratio.label}</span>
                                <span className={`text-[10px] ${isActive ? "text-purple-accent/60" : "text-muted/30"}`}>{ratio.desc}</span>
                              </motion.button>
                            );
                          })}
                        </div>
                        <span className="text-[11px] font-medium text-muted shrink-0 flex items-center gap-1 ml-1">
                          <Clock className="w-3 h-3" />时长
                        </span>
                        <div className="relative flex-1 min-w-[120px]">
                          <button
                            onClick={() => setSoraDurationOpen(!soraDurationOpen)}
                            className="w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:border-white/[0.14] transition-all duration-200"
                          >
                            <span className="text-xs text-white">{soraDuration} 秒</span>
                            <span className="text-[10px] text-muted/40 ml-auto mr-1">{getCredits(selectedModel, soraDuration)} 积分</span>
                            <ChevronDown className={`w-3 h-3 text-muted transition-transform duration-200 ${soraDurationOpen ? "rotate-180" : ""}`} />
                          </button>
                          <AnimatePresence>
                            {soraDurationOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-full mt-1.5 w-[180px] p-1.5 rounded-xl border border-white/[0.08] bg-[#0f0a2e]/95 backdrop-blur-xl shadow-xl z-20"
                              >
                                {soraDurations.map((dur) => {
                                  const isSel = soraDuration === dur.seconds;
                                  return (
                                    <button
                                      key={dur.seconds}
                                      onClick={() => { setSoraDuration(dur.seconds); setSoraDurationOpen(false); }}
                                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                                        isSel ? "bg-cyber-blue/10 text-white" : "text-muted hover:text-white hover:bg-white/[0.04]"
                                      }`}
                                    >
                                      <span className="text-xs font-semibold">{dur.seconds} 秒</span>
                                      <span className={`text-[10px] ${isSel ? "text-cyber-blue/70" : "text-muted/40"}`}>{dur.credits} 积分</span>
                                      {isSel && <span className="ml-1.5 text-[10px] text-cyber-blue">✓</span>}
                                    </button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* ═══════ Seedance 2.0 ═══════ */
                    <>
                      {/* Generation type */}
                      <div className="mb-5">
                        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">生成方式</p>
                        <div className="grid grid-cols-4 gap-2">
                          {seedanceGenTypes.map((gt) => {
                            const isActive = seedanceGenType === gt.id;
                            return (
                              <motion.button
                                key={gt.id}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => handleGenTypeChange(gt.id)}
                                className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-300 ${
                                  isActive
                                    ? `${accentBorder} bg-gradient-to-b ${accentBg} ${accentGlow}`
                                    : "border-white/[0.05] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]"
                                }`}
                              >
                                <gt.icon className={`w-4 h-4 ${isActive ? (isSeedance(selectedModel) ? "text-amber-400" : "text-purple-accent") : "text-muted/40"}`} />
                                <span className={`text-xs font-semibold ${isActive ? "text-white" : "text-muted"}`}>{gt.label}</span>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Prompt + Reference merged row */}
                      <div className="flex gap-5 mb-5">
                        {/* Left: Reference upload */}
                        <div className="w-[220px] shrink-0">
                          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">参考图片</p>
                          <motion.div
                            onDragOver={(e) => { e.preventDefault(); setRefDragOver(true); }}
                            onDragLeave={(e) => { e.preventDefault(); setRefDragOver(false); }}
                            onDrop={handleRefDrop}
                            className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 backdrop-blur-md overflow-hidden ${
                              seedanceGenType === "text-to-video"
                                ? "opacity-40 pointer-events-none border-white/[0.04] bg-white/[0.01]"
                                : refDragOver
                                  ? "border-amber-400/50 bg-amber-500/[0.06] shadow-[0_0_40px_rgba(249,115,22,0.15)]"
                                  : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04]"
                            }`}
                            style={{ height: "220px" }}
                          >
                            {referenceImages.length > 0 ? (
                              <div className="p-3 h-full overflow-y-auto">
                                {seedanceGenType === "multi-ref" ? (
                                  <div className="grid grid-cols-3 gap-1.5">
                                    {referenceImages.map((src, i) => (
                                      <div key={src} className="relative aspect-square rounded-lg overflow-hidden border border-amber-400/20 group">
                                        <img src={src} alt={`参考图 ${i + 1}`} className="w-full h-full object-cover" />
                                        <button
                                          onClick={(e) => removeRefImage(i, e)}
                                          className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500/80 flex items-center justify-center text-white hover:bg-red-500 transition-all duration-150 opacity-0 group-hover:opacity-100"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ))}
                                    {referenceImages.length < maxRef && (
                                      <label className="aspect-square rounded-lg border border-dashed border-amber-400/20 flex items-center justify-center cursor-pointer hover:border-amber-400/40 transition-all duration-150">
                                        <Upload className="w-3.5 h-3.5 text-amber-400/40" />
                                        <input type="file" accept="image/*" multiple onChange={handleRefFileChange} className="hidden" />
                                      </label>
                                    )}
                                  </div>
                                ) : seedanceGenType === "first-last-frame" ? (
                                  <div className="flex gap-3 h-full">
                                    {referenceImages[0] ? (
                                      <div className="flex-1 relative rounded-lg overflow-hidden border border-amber-400/20 group">
                                        <img src={referenceImages[0]} alt="首帧" className="w-full h-full object-cover" />
                                        <button
                                          onClick={(e) => removeRefImage(0, e)}
                                          className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500/80 flex items-center justify-center text-white hover:bg-red-500 transition-all duration-150 opacity-0 group-hover:opacity-100"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                        <span className="absolute bottom-1 left-1 text-[9px] text-white/80 bg-black/50 px-1.5 py-0.5 rounded">首帧</span>
                                      </div>
                                    ) : (
                                      <label className="flex-1 flex flex-col items-center justify-center rounded-lg border border-dashed border-amber-400/20 cursor-pointer hover:border-amber-400/40 transition-all duration-150">
                                        <ImageIcon className="w-5 h-5 text-muted/40 mb-1" />
                                        <span className="text-[10px] text-muted/40">首帧</span>
                                        <input type="file" accept="image/*" onChange={handleRefFileChange} className="hidden" />
                                      </label>
                                    )}
                                    {referenceImages[1] ? (
                                      <div className="flex-1 relative rounded-lg overflow-hidden border border-amber-400/20 group">
                                        <img src={referenceImages[1]} alt="尾帧" className="w-full h-full object-cover" />
                                        <button
                                          onClick={(e) => removeRefImage(1, e)}
                                          className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500/80 flex items-center justify-center text-white hover:bg-red-500 transition-all duration-150 opacity-0 group-hover:opacity-100"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                        <span className="absolute bottom-1 left-1 text-[9px] text-white/80 bg-black/50 px-1.5 py-0.5 rounded">尾帧</span>
                                      </div>
                                    ) : (
                                      <label className="flex-1 flex flex-col items-center justify-center rounded-lg border border-dashed border-amber-400/20 cursor-pointer hover:border-amber-400/40 transition-all duration-150">
                                        <ImageIcon className="w-5 h-5 text-muted/40 mb-1" />
                                        <span className="text-[10px] text-muted/40">尾帧</span>
                                        <input type="file" accept="image/*" onChange={handleRefFileChange} className="hidden" />
                                      </label>
                                    )}
                                  </div>
                                ) : (
                                  /* first-frame: single image */
                                  <div className="flex flex-wrap gap-2">
                                    {referenceImages.map((src, i) => (
                                      <div key={src} className="relative w-full aspect-square rounded-lg overflow-hidden border border-amber-400/20 group">
                                        <img src={src} alt={`参考图 ${i + 1}`} className="w-full h-full object-cover" />
                                        <button
                                          onClick={(e) => removeRefImage(i, e)}
                                          className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500/80 flex items-center justify-center text-white hover:bg-red-500 transition-all duration-150 opacity-0 group-hover:opacity-100"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              renderSeedanceUploadCenter()
                            )}
                          </motion.div>

                          {/* Model variant — below ref area, no label */}
                          <div className="relative mt-3">
                            <button
                              onClick={() => setSeedanceVariantOpen(!seedanceVariantOpen)}
                              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-300 text-left ${
                                seedanceVariantOpen
                                  ? "border-orange-400/40 bg-white/[0.06]"
                                  : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.14] hover:bg-white/[0.05]"
                              }`}
                            >
                              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span className="text-xs font-medium text-white truncate flex-1">{seedanceVariant.label}</span>
                              <ChevronDown className={`w-3 h-3 text-muted shrink-0 transition-transform duration-200 ${seedanceVariantOpen ? "rotate-180" : ""}`} />
                            </button>
                            <AnimatePresence>
                              {seedanceVariantOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: -6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -6 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute inset-x-0 top-full mt-1.5 p-1.5 rounded-xl border border-white/[0.08] bg-[#0f0a2e]/95 backdrop-blur-xl shadow-xl z-20"
                                >
                                  {seedanceVariants.map((v) => {
                                    const isSel = seedanceVariant.id === v.id;
                                    return (
                                      <button
                                        key={v.id}
                                        onClick={() => { setSeedanceVariant(v); setSeedanceVariantOpen(false); }}
                                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                                          isSel ? "bg-amber-500/10 text-white" : "text-muted hover:text-white hover:bg-white/[0.04]"
                                        }`}
                                      >
                                        <Zap className={`w-3.5 h-3.5 ${isSel ? "text-amber-400" : "text-muted/40"}`} />
                                        <p className="text-xs font-semibold">{v.label}</p>
                                        {isSel && <span className="ml-auto text-[10px] text-amber-400">✓</span>}
                                      </button>
                                    );
                                  })}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* Right: Prompt */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">提示词</p>
                          <div className="relative">
                            <textarea
                              value={prompt}
                              onChange={(e) => setPrompt(e.target.value)}
                              placeholder="描述视频内容，避免出现真人或受版权保护的 IP 形象。例如：一个精致的咖啡杯放在木质桌面上，阳光透过窗户洒在杯口，蒸汽缓缓升起..."
                              rows={9}
                              className="w-full px-4 py-3.5 pr-16 text-sm text-white placeholder-muted/30 bg-white/[0.03] border border-white/[0.08] rounded-xl focus:outline-none focus:border-orange-400/40 focus:bg-white/[0.06] focus:shadow-[0_0_24px_rgba(249,115,22,0.1)] transition-all duration-300 resize-none"
                            />
                            <span className="absolute right-3.5 bottom-3.5 text-[11px] text-muted/40">{prompt.length}/5000</span>
                          </div>
                          <AnimatePresence>
                            {prompt.trim().length > 0 && prompt.trim().length < 9 && (
                              <motion.p
                                initial={{ opacity: 0, y: -4, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                exit={{ opacity: 0, y: -4, height: 0 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="flex items-center gap-1.5 mt-2 text-xs text-amber-400/90 overflow-hidden"
                              >
                                <span className="w-1 h-1 rounded-full bg-amber-400/80" />
                                至少 9 个字符
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Video params (compact) */}
                      <div className="flex items-center gap-3 mb-5 p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                        <span className="text-[11px] font-medium text-muted shrink-0 flex items-center gap-1">
                          <Monitor className="w-3 h-3" />画幅
                        </span>
                        <div className="relative flex-1 min-w-[80px]">
                          <button
                            onClick={() => setSeedanceRatioOpen(!seedanceRatioOpen)}
                            className="w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:border-white/[0.14] transition-all duration-200"
                          >
                            <span className="text-xs text-white">{seedanceRatio === "auto" ? "自动" : seedanceRatio}</span>
                            <ChevronDown className={`w-3 h-3 ml-auto text-muted transition-transform duration-200 ${seedanceRatioOpen ? "rotate-180" : ""}`} />
                          </button>
                          <AnimatePresence>
                            {seedanceRatioOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.15 }}
                                className="absolute left-0 top-full mt-1.5 w-[140px] p-1.5 rounded-xl border border-white/[0.08] bg-[#0f0a2e]/95 backdrop-blur-xl shadow-xl z-20 max-h-[240px] overflow-y-auto"
                              >
                                {seedanceRatios.map((r) => {
                                  const isSel = seedanceRatio === r.id;
                                  return (
                                    <button
                                      key={r.id}
                                      onClick={() => { setSeedanceRatio(r.id); setSeedanceRatioOpen(false); }}
                                      className={`w-full px-3 py-2 rounded-lg text-xs text-left transition-all duration-200 ${
                                        isSel ? "bg-amber-500/10 text-white font-semibold" : "text-muted hover:text-white hover:bg-white/[0.04]"
                                      }`}
                                    >
                                      {r.label}
                                      {isSel && <span className="ml-2 text-[10px] text-amber-400">✓</span>}
                                    </button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <span className="text-[11px] font-medium text-muted shrink-0 flex items-center gap-1">
                          <Clock className="w-3 h-3" />时长
                        </span>
                        <div className="relative flex-1 min-w-[100px]">
                          <button
                            onClick={() => setSeedanceDurationOpen(!seedanceDurationOpen)}
                            className="w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:border-white/[0.14] transition-all duration-200"
                          >
                            <span className="text-xs text-white">{seedanceDuration === 0 ? "Auto" : `${seedanceDuration} 秒`}</span>
                            <span className="text-[10px] text-muted/40 ml-auto mr-1">{getCredits(selectedModel, seedanceDuration)} 积分</span>
                            <ChevronDown className={`w-3 h-3 text-muted transition-transform duration-200 ${seedanceDurationOpen ? "rotate-180" : ""}`} />
                          </button>
                          <AnimatePresence>
                            {seedanceDurationOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-full mt-1.5 w-[180px] p-1.5 rounded-xl border border-white/[0.08] bg-[#0f0a2e]/95 backdrop-blur-xl shadow-xl z-20 max-h-[260px] overflow-y-auto"
                              >
                                {seedanceDurations.map((dur) => {
                                  const isSel = seedanceDuration === dur.seconds;
                                  const label = dur.label ?? `${dur.seconds} 秒`;
                                  return (
                                    <button
                                      key={dur.seconds}
                                      onClick={() => { setSeedanceDuration(dur.seconds); setSeedanceDurationOpen(false); }}
                                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                                        isSel ? "bg-amber-500/10 text-white" : "text-muted hover:text-white hover:bg-white/[0.04]"
                                      }`}
                                    >
                                      <span className="text-xs font-semibold">{label}</span>
                                      <span className={`text-[10px] ${isSel ? "text-orange-400/70" : "text-muted/40"}`}>{dur.credits > 0 ? `${dur.credits} 积分` : ""}</span>
                                      {isSel && <span className="ml-1.5 text-[10px] text-amber-400">✓</span>}
                                    </button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSeedanceAudio(!seedanceAudio)}
                          title={seedanceAudio ? "有声" : "静音"}
                          className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border transition-all duration-300 ${
                            seedanceAudio
                              ? "border-orange-400/50 bg-orange-500/15 text-orange-400"
                              : "border-white/[0.08] bg-white/[0.03] text-muted/40 hover:text-muted hover:border-white/[0.14]"
                          }`}
                        >
                          {seedanceAudio ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                        </motion.button>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Example prompts */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">示例提示词</p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {examplePrompts.map((ex, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setPrompt(ex.prompt)}
                      className={`text-left p-4 rounded-xl border transition-all duration-300 group ${
                        isSeedance(selectedModel)
                          ? "border-white/[0.06] bg-white/[0.02] hover:border-orange-400/30 hover:bg-white/[0.04]"
                          : "border-white/[0.06] bg-white/[0.02] hover:border-purple-accent/30 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                          isSeedance(selectedModel)
                            ? "bg-amber-500/15 group-hover:bg-amber-500/25"
                            : "bg-purple-accent/15 group-hover:bg-purple-accent/25"
                        }`}>
                          <Lightbulb className={`w-3 h-3 ${isSeedance(selectedModel) ? "text-amber-400" : "text-purple-accent"}`} />
                        </div>
                        <p className={`text-xs font-semibold text-white transition-colors ${
                          isSeedance(selectedModel) ? "group-hover:text-amber-400" : "group-hover:text-purple-accent"
                        }`}>
                          {ex.title}
                        </p>
                      </div>
                      <p className="text-[11px] text-muted/60 leading-relaxed line-clamp-3">{ex.prompt}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Generate button */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
              >
                <motion.button
                  whileHover={canGenerate ? { scale: 1.01 } : undefined}
                  whileTap={canGenerate ? { scale: 0.97 } : undefined}
                  onClick={handleGenerate}
                  disabled={!canGenerate || isGenerating}
                  className={`w-full relative flex items-center justify-center gap-3 py-4 text-base font-semibold text-white rounded-2xl overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed ${
                    isSeedance(selectedModel)
                      ? "shadow-2xl shadow-orange-500/20"
                      : "shadow-2xl shadow-purple-accent/25"
                  }`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r bg-[length:200%_100%] animate-shimmer ${
                      isSeedance(selectedModel)
                        ? "from-orange-500 via-amber-400 to-orange-600"
                        : "from-purple-accent via-cyber-blue to-purple-accent"
                    }`}
                  />
                  <span className="relative z-10 flex items-center gap-2.5">
                    <Play className="w-5 h-5 fill-white" />
                    {isGenerating ? "生成中..." : "开始生成视频"}
                  </span>
                </motion.button>
                <p className={`text-center text-xs mt-3 ${isSeedance(selectedModel) ? "text-amber-400/70" : "text-muted/50"}`}>
                  预计消耗 {currentCredits} 积分
                </p>
              </motion.div>
            </motion.div>

            {/* ─── Bottom steps ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="mt-8 grid sm:grid-cols-3 gap-4"
            >
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -3 }}
                  className="relative p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md text-center group hover:border-purple-accent/20 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-accent/15 to-cyber-blue/10 flex items-center justify-center mx-auto mb-3 group-hover:from-purple-accent/25 group-hover:to-cyber-blue/15 transition-all duration-300">
                    <step.icon className="w-5 h-5 text-purple-accent" />
                  </div>
                  <p className="text-sm font-semibold text-white mb-1.5">{step.title}</p>
                  <p className="text-xs text-muted/60 leading-relaxed">{step.desc}</p>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-accent/20 border border-purple-accent/30 flex items-center justify-center text-[10px] font-bold text-purple-accent">
                    {i + 1}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* ─── Results ─── */}
            <motion.div
              ref={resultsRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
              className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md overflow-hidden"
            >
              {isGenerating ? (
                <div className="p-6 flex flex-col items-center">
                  <h2 className="text-sm font-semibold text-white mb-4 self-start">生成中...</h2>
                  <div className="w-full max-w-[240px]">
                    <div className="relative aspect-[9/16] rounded-xl bg-white/[0.03] border border-white/[0.04] overflow-hidden">
                      <div className="absolute inset-0 skeleton-shimmer" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-12 h-12 rounded-full bg-purple-accent/20 flex items-center justify-center"
                        >
                          <Play className="w-5 h-5 text-purple-accent fill-purple-accent ml-0.5" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/[0.06]">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                      <Sparkles className="w-3 h-3 text-purple-accent" />
                    </motion.div>
                    <span className="text-xs font-medium text-muted">AI 生成中 · 预计 2-5 分钟</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-16">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.04] flex items-center justify-center">
                    <Video className="w-6 h-6 text-muted/40" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted font-medium">暂无生成结果</p>
                    <p className="text-xs text-muted/50 mt-0.5">上传参考图并填写提示词后开始生成视频</p>
                  </div>
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
