"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Scissors,
  Upload,
  Image as ImageIcon,
  X,
  Sparkles,
  Clock,
  AlertTriangle,
  Download,
  Eye,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { GlowOrb } from "@/components/GlowOrb";
import { Sidebar } from "@/components/Sidebar";
import { ScrollToTop } from "@/components/ScrollToTop";

/* ─── Types ─── */

interface HistoryItem {
  id: string;
  originalName: string;
  originalUrl: string;
  resultUrl: string;
  timestamp: number;
}

/* ─── Component ─── */

export default function RemoveWatermarkPage() {
  const [uploadedImage, setUploadedImage] = useState<{ url: string; name: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMsg, setWarningMsg] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [viewingResult, setViewingResult] = useState<HistoryItem | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);
  const maxFileMB = 10;

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;

    if (file.size > maxFileMB * 1024 * 1024) {
      setWarningMsg(`图片 "${file.name}" 大小为 ${Math.round(file.size / 1024 / 1024)}MB，超过 ${maxFileMB}MB 限制`);
      setShowWarning(true);
      return;
    }

    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage.url);
    }
    setUploadedImage({
      url: URL.createObjectURL(file),
      name: file.name,
    });
  }, [uploadedImage]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files?.[0]) {
        processFile(e.dataTransfer.files[0]);
      }
    },
    [processFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        processFile(e.target.files[0]);
      }
      e.target.value = "";
    },
    [processFile]
  );

  const handleRemove = useCallback(() => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage.url);
      setUploadedImage(null);
    }
  }, [uploadedImage]);

  const handleProcess = useCallback(() => {
    if (!uploadedImage) return;
    setIsProcessing(true);
    setTimeout(() => {
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        originalName: uploadedImage.name,
        originalUrl: uploadedImage.url,
        resultUrl: uploadedImage.url, // mock: same image as result
        timestamp: Date.now(),
      };
      setHistory((prev) => [newItem, ...prev]);
      setIsProcessing(false);
      setUploadedImage(null);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 3000);
  }, [uploadedImage]);

  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory((prev) => prev.filter((h) => h.id !== id));
    if (viewingResult?.id === id) setViewingResult(null);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <GlowOrb color="rgba(139, 92, 246, 0.12)" className="top-0 left-1/4" size={500} />
      <GlowOrb color="rgba(6, 182, 212, 0.06)" className="top-1/2 -right-20" size={400} />

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
                  <p className="text-xs text-muted">单张图片不超过 {maxFileMB}MB</p>
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

      {/* Result viewer modal */}
      <AnimatePresence>
        {viewingResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
            onClick={() => setViewingResult(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-2xl w-full mx-4 p-5 rounded-2xl border border-white/[0.08] bg-[#0f0a2e]/95 backdrop-blur-2xl shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-white">结果预览</p>
                <button
                  onClick={() => setViewingResult(null)}
                  className="p-1.5 rounded-lg text-muted hover:text-white hover:bg-white/[0.08] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-muted/50 mb-2 uppercase tracking-wider">原图</p>
                  <div className="aspect-square rounded-xl bg-black/40 border border-white/[0.06] overflow-hidden">
                    <img src={viewingResult.originalUrl} alt="原图" className="w-full h-full object-contain" />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-muted/50 mb-2 uppercase tracking-wider">去水印后</p>
                  <div className="aspect-square rounded-xl bg-black/40 border border-emerald-400/20 overflow-hidden">
                    <img src={viewingResult.resultUrl} alt="去水印后" className="w-full h-full object-contain" />
                  </div>
                </div>
              </div>
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
                    <Scissors className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h1 className="text-xl font-semibold tracking-tight text-white">
                    智能去水印
                  </h1>
                </div>
              </div>
              <p className="text-sm text-muted ml-[132px]">
                使用 AI 智能去除图片上的水印、文字、logo ·{" "}
                <span className="text-purple-accent font-medium">50 积分/张</span>
              </p>
            </motion.div>

            {/* ─── Upload zone ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
            >
              <motion.div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
                onDrop={handleDrop}
                className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 backdrop-blur-md ${
                  uploadedImage
                    ? "p-5"
                    : "flex flex-col items-center justify-center py-20 cursor-pointer"
                } ${
                  dragOver
                    ? "border-purple-accent bg-purple-accent/[0.08] shadow-[0_0_40px_rgba(139,92,246,0.2)]"
                    : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04]"
                }`}
              >
                {uploadedImage ? (
                  <div>
                    <div className="flex gap-4">
                      <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-white/[0.08] group">
                        <img
                          src={uploadedImage.url}
                          alt={uploadedImage.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={handleRemove}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/80 flex items-center justify-center text-white hover:bg-red-500 transition-all duration-150"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-sm font-semibold text-white mb-1">{uploadedImage.name}</p>
                        <p className="text-xs text-muted mb-4">图片已就绪，点击下方按钮开始去水印</p>
                        <label className="inline-flex items-center gap-1.5 text-xs text-purple-accent hover:text-purple-accent/80 cursor-pointer transition-colors">
                          <Upload className="w-3 h-3" />
                          重新选择图片
                          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <motion.div
                      animate={dragOver ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300 ${
                        dragOver ? "bg-purple-accent/20 text-purple-accent" : "bg-white/[0.05] text-muted"
                      }`}
                    >
                      {dragOver ? <Scissors className="w-7 h-7" /> : <Upload className="w-7 h-7" />}
                    </motion.div>
                    <p className="text-base font-semibold text-white mb-1.5">拖拽图片到此处或点击上传</p>
                    <p className="text-sm text-muted/50">支持 JPG / PNG / WebP · 单张 ≤ {maxFileMB}MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                  </>
                )}
              </motion.div>
            </motion.div>

            {/* ─── Process button ─── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
              className="mt-5"
            >
              <motion.button
                whileHover={uploadedImage && !isProcessing ? { scale: 1.01 } : undefined}
                whileTap={uploadedImage && !isProcessing ? { scale: 0.97 } : undefined}
                onClick={handleProcess}
                disabled={!uploadedImage || isProcessing}
                className="w-full relative flex items-center justify-center gap-3 py-4 text-base font-semibold text-white rounded-2xl overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed shadow-2xl shadow-purple-accent/25"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-accent via-cyber-blue to-purple-accent bg-[length:200%_100%] animate-shimmer" />
                <span className="relative z-10 flex items-center gap-2.5">
                  <Scissors className="w-5 h-5" />
                  {isProcessing ? "处理中..." : "开始去水印"}
                </span>
              </motion.button>
              <p className="text-center text-xs text-muted/50 mt-3">
                预计消耗 50 积分
              </p>
            </motion.div>

            {/* ─── History ─── */}
            <motion.div
              ref={resultsRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
              className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md overflow-hidden"
            >
              <div className="p-5 border-b border-white/[0.06]">
                <p className="text-sm font-semibold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted/50" />
                  历史记录
                  <span className="text-[11px] text-muted/40 font-normal">{history.length} 条</span>
                </p>
              </div>

              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.04] flex items-center justify-center mb-3">
                    <Clock className="w-6 h-6 text-muted/25" />
                  </div>
                  <p className="text-sm text-muted/40 font-medium">暂无记录</p>
                  <p className="text-xs text-muted/30 mt-0.5">去水印处理后的图片将在这里显示</p>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.04]">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors duration-150 group"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/[0.06] shrink-0 bg-black/40">
                        <img src={item.resultUrl} alt={item.originalName} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">{item.originalName}</p>
                        <p className="text-[11px] text-muted/40 mt-0.5">
                          {new Date(item.timestamp).toLocaleString("zh-CN")}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setViewingResult(item)}
                          className="p-2 rounded-lg text-muted/40 hover:text-white hover:bg-white/[0.08] transition-all duration-150"
                          title="查看"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-lg text-muted/40 hover:text-white hover:bg-white/[0.08] transition-all duration-150"
                          title="下载"
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => handleDeleteHistory(item.id, e)}
                          className="p-2 rounded-lg text-muted/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 opacity-0 group-hover:opacity-100"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  ))}
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
