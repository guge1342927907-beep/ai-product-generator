"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronDown, Zap, Cpu, Star } from "lucide-react";

export interface Model {
  id: string;
  label: string;
  desc: string;
  badge?: string;
  icon: typeof Sparkles;
  color: string;
}

const models: Model[] = [
  {
    id: "banana-pro",
    label: "Banana Pro",
    desc: "默认模型 · 均衡画质与速度",
    badge: "推荐",
    icon: Sparkles,
    color: "from-purple-accent to-cyber-blue",
  },
  {
    id: "gpt-image-2",
    label: "GPT Image 2 ×1.5",
    desc: "高画质精品 · 细节增强 · 适合正式出图",
    icon: Cpu,
    color: "from-violet-500 to-purple-500",
  },
  {
    id: "banana-lite",
    label: "Banana Lite",
    desc: "快速模型 · 批量生成 · 适合预览草稿",
    icon: Zap,
    color: "from-cyber-blue to-emerald-400",
  },
];

interface ModelSelectorProps {
  selected: Model;
  onSelect: (model: Model) => void;
}

export function ModelSelector({ selected, onSelect }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all duration-300 ${
          open
            ? "border-purple-accent/40 bg-white/[0.06] glow-ring"
            : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.16] hover:bg-white/[0.05]"
        }`}
      >
        {/* Model icon */}
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selected.color} flex items-center justify-center shadow-lg shrink-0`}
          style={{ opacity: 0.9 }}
        >
          <selected.icon className="w-5 h-5 text-white" />
        </div>

        {/* Model info */}
        <div className="text-left flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-white">{selected.label}</p>
            {selected.badge && (
              <span className="px-1.5 py-0.5 rounded-md bg-purple-accent/20 text-[10px] font-bold text-purple-accent border border-purple-accent/25">
                {selected.badge}
              </span>
            )}
          </div>
          <p className="text-xs text-muted truncate">{selected.desc}</p>
        </div>

        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <ChevronDown
            className={`w-4 h-4 transition-colors duration-200 ${
              open ? "text-purple-accent" : "text-muted/50"
            }`}
          />
        </motion.div>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-x-0 top-full mt-2.5 p-2 rounded-2xl border border-white/[0.1] bg-[#0f0a2e]/95 backdrop-blur-2xl shadow-2xl shadow-purple-accent/10 z-30"
          >
            {/* Ambient glow behind dropdown */}
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-b from-purple-accent/5 to-transparent pointer-events-none" />

            <div className="relative flex flex-col gap-1">
              {models.map((model) => {
                const isSelected = selected.id === model.id;
                return (
                  <motion.button
                    key={model.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      onSelect(model);
                      setOpen(false);
                    }}
                    className={`relative flex items-center gap-4 px-3.5 py-3 rounded-xl text-left transition-all duration-200 group ${
                      isSelected
                        ? "text-white"
                        : "text-muted hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    {/* Selected background */}
                    {isSelected && (
                      <motion.div
                        layoutId="model-selected-bg"
                        className={`absolute inset-0 rounded-xl bg-gradient-to-r ${model.color} opacity-15`}
                        transition={{
                          type: "spring",
                          bounce: 0.15,
                          duration: 0.45,
                        }}
                      />
                    )}

                    {/* Selected border glow */}
                    {isSelected && (
                      <motion.div
                        layoutId="model-border-glow"
                        className={`absolute inset-0 rounded-xl ring-1 ring-inset ${
                          model.id === "banana-pro"
                            ? "ring-purple-accent/50"
                            : model.id === "gpt-image-2"
                              ? "ring-violet-400/40"
                              : "ring-cyber-blue/40"
                        }`}
                        transition={{
                          type: "spring",
                          bounce: 0.15,
                          duration: 0.45,
                        }}
                      />
                    )}

                    {/* Model icon */}
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

                    {/* Model info */}
                    <div className="relative z-10 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p
                          className={`text-sm font-semibold ${
                            isSelected ? "text-white" : "text-muted/80 group-hover:text-white"
                          }`}
                        >
                          {model.label}
                        </p>
                        {model.badge && (
                          <span
                            className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold border transition-colors duration-200 ${
                              isSelected
                                ? "bg-purple-accent/20 text-purple-accent border-purple-accent/30"
                                : "bg-white/[0.04] text-muted/60 border-white/[0.06] group-hover:text-purple-accent group-hover:bg-purple-accent/15 group-hover:border-purple-accent/25"
                            }`}
                          >
                            {model.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted/50 mt-0.5">{model.desc}</p>
                    </div>

                    {/* Selected indicator */}
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
  );
}

export { models };
