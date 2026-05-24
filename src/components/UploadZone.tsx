"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image as ImageIcon, Info, X, Plus, AlertTriangle } from "lucide-react";

const MAX_IMAGES = 8;

export function UploadZone() {
  const [images, setImages] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [exceededCount, setExceededCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addMoreInputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const imageFiles = fileArray.filter((f) => f.type.startsWith("image/"));
      const remaining = MAX_IMAGES - images.length;

      if (imageFiles.length > remaining) {
        setExceededCount(imageFiles.length);
        setShowWarning(true);
        if (remaining <= 0) return;
        imageFiles.splice(remaining);
      }

      const newUrls = imageFiles.map((f) => URL.createObjectURL(f));
      setImages((prev) => [...prev, ...newUrls]);
    },
    [images.length]
  );

  const removeImage = useCallback((index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImages((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[index]);
      next.splice(index, 1);
      return next;
    });
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
      }
      e.target.value = "";
    },
    [processFiles]
  );

  const handleDrag = useCallback((e: React.DragEvent, over: boolean) => {
    e.preventDefault();
    setDragOver(over);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const hasImages = images.length > 0;
  const canAddMore = images.length < MAX_IMAGES;

  return (
    <>
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
                  <p className="text-xs text-muted">最多只能上传 {MAX_IMAGES} 张图片</p>
                </div>
              </div>
              <p className="text-sm text-muted/80 mb-5 leading-relaxed">
                你选择了 {exceededCount} 张图片，但一次最多只能上传 {MAX_IMAGES} 张。超出的图片已被自动忽略。
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

      {/* Upload area */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        onDragOver={(e) => handleDrag(e, true)}
        onDragLeave={(e) => handleDrag(e, false)}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 backdrop-blur-md ${
          dragOver
            ? "border-purple-accent bg-purple-accent/[0.08] shadow-[0_0_40px_rgba(139,92,246,0.2)]"
            : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04]"
        } ${hasImages ? "p-4" : "flex flex-col items-center justify-center h-72 cursor-pointer"}`}
      >
        {hasImages ? (
          /* ── Filled state: thumbnail grid + add more ── */
          <div>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {images.map((url, i) => (
                <div
                  key={url}
                  className="group relative aspect-square rounded-xl overflow-hidden border border-white/[0.08] bg-white/[0.04]"
                >
                  <img
                    src={url}
                    alt={`上传图片 ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Delete button */}
                  <button
                    onClick={(e) => removeImage(i, e)}
                    className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500/80 flex items-center justify-center text-[11px] text-white hover:bg-red-500 transition-all duration-150 opacity-0 group-hover:opacity-100 z-10"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {/* Add more tile */}
              {canAddMore && (
                <label className="relative aspect-square rounded-xl border border-dashed border-white/[0.10] bg-white/[0.02] flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-purple-accent/50 hover:bg-purple-accent/[0.05] transition-all duration-200">
                  <input
                    ref={addMoreInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Plus className="w-5 h-5 text-muted/50" />
                  <span className="text-[10px] text-muted/40">
                    {images.length}/{MAX_IMAGES}
                  </span>
                </label>
              )}
              {/* Empty placeholder tiles */}
              {!canAddMore &&
                Array.from({ length: Math.max(0, MAX_IMAGES - images.length) }).map(
                  (_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="aspect-square rounded-xl border border-dashed border-white/[0.04] bg-white/[0.01]"
                    />
                  )
                )}
            </div>

            {/* Info hint */}
            <div className="flex items-start gap-1.5 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
              <Info className="w-3.5 h-3.5 text-purple-accent/60 shrink-0 mt-px" />
              <p className="text-[11px] text-muted/70 leading-relaxed">
                图片越清晰、角度越完整，生成结果越贴近实物 · 已上传 {images.length}/{MAX_IMAGES} 张
              </p>
            </div>
          </div>
        ) : (
          /* ── Empty state: upload prompt ── */
          <>
            <motion.div
              animate={dragOver ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300 ${
                dragOver
                  ? "bg-purple-accent/20 text-purple-accent shadow-lg shadow-purple-accent/20"
                  : "bg-white/[0.05] text-muted"
              }`}
            >
              {dragOver ? (
                <ImageIcon className="w-6 h-6" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
            </motion.div>

            <p className="text-sm font-semibold text-white mb-1">
              {dragOver ? "松开以上传图片" : "拖拽图片到此处或点击上传"}
            </p>
            <p className="text-xs text-muted mb-3">
              支持 JPG、PNG，最多 {MAX_IMAGES} 张
            </p>

            {/* Info hint */}
            <div className="flex items-start gap-1.5 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.04] max-w-[260px]">
              <Info className="w-3.5 h-3.5 text-purple-accent/60 shrink-0 mt-px" />
              <p className="text-[11px] text-muted/70 leading-relaxed">
                图片越清晰、角度越完整，生成结果越贴近实物
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </>
        )}
      </motion.div>
    </>
  );
}
