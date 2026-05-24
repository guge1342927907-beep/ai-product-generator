"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Shield,
  Plus,
  Image as ImageIcon,
  Trash2,
  Eye,
  Grid3X3,
  Square,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { GlowOrb } from "@/components/GlowOrb";
import { Sidebar } from "@/components/Sidebar";
import { ScrollToTop } from "@/components/ScrollToTop";

/* ─── Data ─── */

const fonts = [
  "文泉驿正黑",
  "思源黑体",
  "站酷快乐体",
  "方正兰亭黑",
  "阿里巴巴普惠体",
  "HarmonyOS Sans",
];

const positions = [
  { id: "top-left", label: "左上", col: 1, row: 1 },
  { id: "top-center", label: "上中", col: 2, row: 1 },
  { id: "top-right", label: "右上", col: 3, row: 1 },
  { id: "middle-left", label: "左中", col: 1, row: 2 },
  { id: "center", label: "居中", col: 2, row: 2 },
  { id: "middle-right", label: "右中", col: 3, row: 2 },
  { id: "bottom-left", label: "左下", col: 1, row: 3 },
  { id: "bottom-center", label: "下中", col: 2, row: 3 },
  { id: "bottom-right", label: "右下", col: 3, row: 3 },
];

interface WatermarkTemplate {
  id: string;
  name: string;
  type: "text" | "image";
  text: string;
  font: string;
  fontSize: number;
  color: string;
  position: string;
  opacity: number;
  rotation: number;
  tileMode: "single" | "tile";
}

const defaultTemplate: WatermarkTemplate = {
  id: "",
  name: "",
  type: "text",
  text: "SAMPLE",
  font: fonts[0],
  fontSize: 24,
  color: "#ffffff",
  position: "bottom-right",
  opacity: 40,
  rotation: 0,
  tileMode: "single",
};

/* ─── Component ─── */

export default function WatermarkPage() {
  const [templates, setTemplates] = useState<WatermarkTemplate[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<WatermarkTemplate>({ ...defaultTemplate });

  const isNew = selectedId === "__new__";

  const handleNew = () => {
    const fresh = { ...defaultTemplate, id: "__new__" };
    setEditing(fresh);
    setSelectedId("__new__");
  };

  const handleSelect = (t: WatermarkTemplate) => {
    setEditing({ ...t });
    setSelectedId(t.id);
  };

  const handleSave = useCallback(() => {
    if (!editing.name.trim()) return;
    if (isNew) {
      const t = { ...editing, id: Date.now().toString() };
      setTemplates((prev) => [...prev, t]);
      setSelectedId(t.id);
    } else {
      setTemplates((prev) => prev.map((t) => (t.id === editing.id ? editing : t)));
    }
  }, [editing, isNew]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  const update = (patch: Partial<WatermarkTemplate>) => {
    setEditing((prev) => ({ ...prev, ...patch }));
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <GlowOrb color="rgba(139, 92, 246, 0.10)" className="top-0 left-1/3" size={450} />
      <GlowOrb color="rgba(6, 182, 212, 0.06)" className="top-1/2 -right-16" size={350} />

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
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-accent to-cyber-blue flex items-center justify-center shadow-md shadow-purple-accent/25">
                    <Shield className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h1 className="text-xl font-semibold tracking-tight text-white">
                    水印模板管理
                  </h1>
                </div>
              </div>
              <p className="text-sm text-muted ml-[132px]">
                创建和管理您的水印预设 · 实时预览
              </p>
            </motion.div>

            {/* ─── Main layout ─── */}
            <div className="flex gap-6">
              {/* ── Left: Template list ── */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
                className="w-[260px] shrink-0"
              >
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-white">我的模板</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNew}
                      disabled={templates.length >= 10}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white rounded-lg bg-gradient-to-r from-purple-accent to-cyber-blue hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity shadow-md shadow-purple-accent/20"
                    >
                      <Plus className="w-3 h-3" />新建
                    </motion.button>
                  </div>

                  <div className="space-y-1.5 max-h-[520px] overflow-y-auto">
                    {templates.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-muted/40">
                        <Shield className="w-8 h-8 mb-2" />
                        <span className="text-xs">暂无模板</span>
                        <span className="text-[10px] mt-0.5">点击「新建」创建水印预设</span>
                      </div>
                    ) : (
                      templates.map((t) => (
                        <motion.button
                          key={t.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelect(t)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group ${
                            selectedId === t.id
                              ? "bg-purple-accent/15 border border-purple-accent/30 text-white"
                              : "border border-transparent text-muted hover:text-white hover:bg-white/[0.04]"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            selectedId === t.id
                              ? "bg-purple-accent/25"
                              : "bg-white/[0.05] group-hover:bg-white/[0.08]"
                          }`}>
                            <Eye className={`w-4 h-4 ${selectedId === t.id ? "text-purple-accent" : "text-muted/40"}`} />
                          </div>
                          <span className="text-xs font-medium truncate flex-1">{t.name}</span>
                          <button
                            onClick={(e) => handleDelete(t.id, e)}
                            className="p-1 rounded-md text-muted/30 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-150"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </motion.button>
                      ))
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/[0.06]">
                    <p className="text-[10px] text-muted/40">
                      {templates.length} / 10 个模板
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* ── Right: Editor ── */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                className="flex-1 min-w-0"
              >
                <AnimatePresence mode="wait">
                  {selectedId ? (
                    <motion.div
                      key="editor"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-5"
                    >
                      <div className="flex gap-6">
                        {/* Preview */}
                        <div className="w-[280px] shrink-0">
                          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                            实时预览
                          </p>
                          <div className="relative aspect-square rounded-xl bg-[#0a0620] border border-white/[0.08] overflow-hidden">
                            {/* Mock product image area */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08] flex items-center justify-center">
                                <ImageIcon className="w-10 h-10 text-muted/20" />
                              </div>
                            </div>
                            {/* Watermark overlay */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <span
                                style={{
                                  color: editing.color,
                                  opacity: editing.opacity / 100,
                                  fontSize: `${editing.fontSize}px`,
                                  fontFamily: editing.font,
                                  transform: `rotate(${editing.rotation}deg)`,
                                }}
                                className="font-bold whitespace-nowrap select-none"
                              >
                                {editing.text || "SAMPLE"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Settings form */}
                        <div className="flex-1 min-w-0 space-y-4">
                          {/* Template name */}
                          <div>
                            <label className="text-[11px] font-medium text-muted mb-1 block">
                              模板名称
                            </label>
                            <input
                              value={editing.name}
                              onChange={(e) => update({ name: e.target.value })}
                              placeholder="输入模板名称..."
                              className="w-full px-3 py-2 text-sm text-white placeholder-muted/30 bg-white/[0.03] border border-white/[0.08] rounded-lg focus:outline-none focus:border-purple-accent/40 transition-all duration-200"
                            />
                          </div>

                          {/* Type toggle */}
                          <div>
                            <label className="text-[11px] font-medium text-muted mb-1 block">
                              水印类型
                            </label>
                            <div className="flex gap-1.5">
                              {(["text", "image"] as const).map((type) => (
                                <motion.button
                                  key={type}
                                  whileTap={{ scale: 0.96 }}
                                  onClick={() => update({ type })}
                                  className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all duration-200 ${
                                    editing.type === type
                                      ? "border-purple-accent/50 bg-purple-accent/15 text-white"
                                      : "border-white/[0.06] bg-white/[0.02] text-muted hover:border-white/[0.14]"
                                  }`}
                                >
                                  {type === "text" ? "文字" : "图片"}
                                </motion.button>
                              ))}
                            </div>
                          </div>

                          {/* Text watermarks settings */}
                          {editing.type === "text" && (
                            <>
                              <div>
                                <label className="text-[11px] font-medium text-muted mb-1 block">
                                  水印文字
                                </label>
                                <input
                                  value={editing.text}
                                  onChange={(e) => update({ text: e.target.value })}
                                  placeholder="输入水印文字..."
                                  className="w-full px-3 py-2 text-sm text-white placeholder-muted/30 bg-white/[0.03] border border-white/[0.08] rounded-lg focus:outline-none focus:border-purple-accent/40 transition-all duration-200"
                                />
                              </div>

                              <div className="flex gap-3">
                                <div className="flex-1">
                                  <label className="text-[11px] font-medium text-muted mb-1 block">
                                    字体
                                  </label>
                                  <select
                                    value={editing.font}
                                    onChange={(e) => update({ font: e.target.value })}
                                    className="w-full px-3 py-2 text-sm text-white bg-white/[0.03] border border-white/[0.08] rounded-lg focus:outline-none focus:border-purple-accent/40 transition-all duration-200 appearance-none"
                                  >
                                    {fonts.map((f) => (
                                      <option key={f} value={f} className="bg-[#0f0a2e]">
                                        {f}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div className="w-20">
                                  <label className="text-[11px] font-medium text-muted mb-1 block">
                                    字号
                                  </label>
                                  <input
                                    type="number"
                                    value={editing.fontSize}
                                    onChange={(e) =>
                                      update({ fontSize: Math.max(8, Math.min(120, +e.target.value)) })
                                    }
                                    className="w-full px-3 py-2 text-sm text-white bg-white/[0.03] border border-white/[0.08] rounded-lg focus:outline-none focus:border-purple-accent/40 transition-all duration-200"
                                  />
                                </div>
                              </div>

                              {/* Color picker */}
                              <div>
                                <label className="text-[11px] font-medium text-muted mb-1 block">
                                  颜色
                                </label>
                                <div className="flex items-center gap-3">
                                  <div className="relative">
                                    <input
                                      type="color"
                                      value={editing.color}
                                      onChange={(e) => update({ color: e.target.value })}
                                      className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <div
                                      className="w-9 h-9 rounded-lg border-2 border-white/[0.12] cursor-pointer"
                                      style={{ backgroundColor: editing.color }}
                                    />
                                  </div>
                                  <span className="text-xs text-muted/50 font-mono">
                                    {editing.color}
                                  </span>
                                </div>
                              </div>
                            </>
                          )}

                          {/* Position grid */}
                          <div>
                            <label className="text-[11px] font-medium text-muted mb-1.5 block">
                              位置
                            </label>
                            <div className="grid grid-cols-3 gap-1 w-[120px]">
                              {positions.map((p) => (
                                <motion.button
                                  key={p.id}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => update({ position: p.id })}
                                  className={`w-full aspect-square rounded-md border transition-all duration-200 flex items-center justify-center ${
                                    editing.position === p.id
                                      ? "border-purple-accent/50 bg-purple-accent/20"
                                      : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.14]"
                                  }`}
                                  title={p.label}
                                >
                                  {editing.position === p.id && (
                                    <motion.div
                                      layoutId="pos-dot"
                                      className="w-1.5 h-1.5 rounded-full bg-purple-accent"
                                    />
                                  )}
                                </motion.button>
                              ))}
                            </div>
                          </div>

                          {/* Opacity slider */}
                          <div>
                            <label className="text-[11px] font-medium text-muted mb-1 flex items-center justify-between">
                              <span>不透明度</span>
                              <span className="text-[10px] text-muted/40">{editing.opacity}%</span>
                            </label>
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={editing.opacity}
                              onChange={(e) => update({ opacity: +e.target.value })}
                              className="w-full h-1.5 rounded-full appearance-none bg-white/[0.08] accent-purple-accent cursor-pointer"
                            />
                          </div>

                          {/* Rotation slider */}
                          <div>
                            <label className="text-[11px] font-medium text-muted mb-1 flex items-center justify-between">
                              <span>旋转角度</span>
                              <span className="text-[10px] text-muted/40">{editing.rotation}°</span>
                            </label>
                            <input
                              type="range"
                              min={-180}
                              max={180}
                              value={editing.rotation}
                              onChange={(e) => update({ rotation: +e.target.value })}
                              className="w-full h-1.5 rounded-full appearance-none bg-white/[0.08] accent-purple-accent cursor-pointer"
                            />
                          </div>

                          {/* Tile mode */}
                          <div>
                            <label className="text-[11px] font-medium text-muted mb-1 block">
                              平铺模式
                            </label>
                            <div className="flex gap-1.5">
                              {([
                                { id: "single", label: "单个", icon: Square },
                                { id: "tile", label: "平铺", icon: Grid3X3 },
                              ] as const).map((mode) => (
                                <motion.button
                                  key={mode.id}
                                  whileTap={{ scale: 0.96 }}
                                  onClick={() => update({ tileMode: mode.id })}
                                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all duration-200 ${
                                    editing.tileMode === mode.id
                                      ? "border-purple-accent/50 bg-purple-accent/15 text-white"
                                      : "border-white/[0.06] bg-white/[0.02] text-muted hover:border-white/[0.14]"
                                  }`}
                                >
                                  <mode.icon className="w-3 h-3" />
                                  {mode.label}
                                </motion.button>
                              ))}
                            </div>
                          </div>

                          {/* Save button */}
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleSave}
                            disabled={!editing.name.trim()}
                            className="w-full py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-purple-accent to-cyber-blue hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity shadow-lg shadow-purple-accent/20"
                          >
                            {isNew ? "创建模板" : "保存修改"}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl flex flex-col items-center justify-center py-24"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.04] flex items-center justify-center mb-4">
                        <Shield className="w-7 h-7 text-muted/25" />
                      </div>
                      <p className="text-sm text-muted/50 font-medium mb-1">选择或新建一个模板</p>
                      <p className="text-xs text-muted/30">从左侧列表中选择已有模板，或点击「新建」创建一个</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
      <ScrollToTop />
    </div>
  );
}
