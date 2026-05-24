"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { GripHorizontal, ArrowLeftRight } from "lucide-react";

export function BeforeAfterSlider() {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    const onUp = () => (dragging.current = false);
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      setSliderPos(x);
    };
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove);
    return () => {
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
    };
  }, []);

  return (
    <section id="showcase" className="relative py-32 px-6">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold tracking-[0.2em] text-purple-accent uppercase mb-4">
            Before & After
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            看看 AI 的{" "}
            <span className="text-gradient-static">实际效果</span>
          </h2>
          <p className="mt-4 text-muted text-base max-w-lg mx-auto">
            拖拽滑块查看对比 — 从普通产品照片到专业电商主图的蜕变
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          ref={containerRef}
          className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.02] backdrop-blur-md shadow-2xl cursor-col-resize select-none"
          onMouseDown={() => (dragging.current = true)}
          onTouchStart={() => (dragging.current = true)}
        >
          {/* Before side */}
          <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a2e]">
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.05] flex items-center justify-center">
                <ArrowLeftRight className="w-7 h-7 text-muted" />
              </div>
              <p className="text-2xl font-bold text-muted mb-2">Before</p>
              <p className="text-sm text-muted/70 max-w-xs">
                原始产品照片 — 杂乱背景、平淡光线
              </p>
              <div className="mt-6 mx-auto w-24 h-32 rounded-xl bg-white/[0.06] border border-white/[0.05]" />
            </div>
          </div>

          {/* After side — clipped */}
          <div
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0c0824] via-[#0f0a2e] to-[#0a1628]"
            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          >
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-accent/20 to-cyber-blue/20 border border-purple-accent/30 flex items-center justify-center shadow-lg shadow-purple-accent/20">
                <ArrowLeftRight className="w-7 h-7 text-purple-accent" />
              </div>
              <p className="text-2xl font-bold text-gradient-static mb-2">After</p>
              <p className="text-sm text-muted/90 max-w-xs">
                AI 增强产品图 — 专业棚拍灯光、干净背景
              </p>
              <div className="mt-6 mx-auto w-24 h-32 rounded-xl bg-gradient-to-br from-purple-accent/25 to-cyber-blue/25 border border-purple-accent/30 shadow-lg shadow-purple-accent/20" />
            </div>
          </div>

          {/* Drag handle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-col-resize"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
              <GripHorizontal className="w-5 h-5 text-[#030014]" />
            </div>
          </div>

          <div className="absolute top-4 left-6 px-3 py-1.5 text-xs font-semibold text-white/80 rounded-lg bg-black/40 backdrop-blur-md">
            原图
          </div>
          <div className="absolute top-4 right-6 px-3 py-1.5 text-xs font-semibold text-white/80 rounded-lg bg-black/40 backdrop-blur-md">
            AI 生成
          </div>
        </motion.div>
      </div>
    </section>
  );
}
