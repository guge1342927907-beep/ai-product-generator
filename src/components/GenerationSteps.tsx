"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Image, Layers, Upload } from "lucide-react";

const steps = [
  {
    step: "①",
    title: "选择生成模式",
    items: [
      {
        icon: Zap,
        label: "标准极速",
        desc: "快速出图，适合批量",
        price: "199 积分起",
        highlight: false,
      },
      {
        icon: Sparkles,
        label: "PRO 增强",
        desc: "高画质精品",
        price: "100 积分/张",
        highlight: true,
      },
    ],
  },
  {
    step: "②",
    title: "生成内容配置",
    items: [
      {
        icon: Image,
        label: "主图生成 + 详情页",
        desc: "Shopee / 虾皮 平台",
        price: "",
        highlight: false,
      },
    ],
  },
  {
    step: "③",
    title: "上传商品图片",
    items: [
      {
        icon: Upload,
        label: "拖拽或点击上传",
        desc: "JPG、PNG，最多 8 张",
        price: "",
        highlight: false,
      },
    ],
  },
];

export function GenerationSteps() {
  return (
    <section id="features" className="relative py-32 px-6">
      <div className="mx-auto max-w-5xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold tracking-[0.2em] text-purple-accent uppercase mb-4">
            生成流程
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            三步生成你的{" "}
            <span className="text-gradient-static">专业电商图</span>
          </h2>
          <p className="mt-4 text-muted text-base max-w-lg mx-auto">
            上传图片并选择风格，让 AI 为您生成专业主图
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid lg:grid-cols-3 gap-6">
          {steps.map((step, stepIdx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: stepIdx * 0.15, ease: "easeOut" }}
              className="glass-card rounded-3xl p-6 sm:p-8"
            >
              <span className="inline-block text-sm font-bold text-purple-accent mb-4">
                {step.step}
              </span>
              <h3 className="text-lg font-semibold text-white mb-6">
                {step.title}
              </h3>

              <div className="space-y-3">
                {step.items.map((item) => (
                  <motion.div
                    key={item.label}
                    whileHover={{ scale: 1.02 }}
                    className={`relative flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 cursor-default ${
                      item.highlight
                        ? "bg-gradient-to-br from-purple-accent/15 to-cyber-blue/10 border border-purple-accent/30 glow-ring"
                        : "bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.1] hover:bg-white/[0.04]"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        item.highlight
                          ? "bg-gradient-to-br from-purple-accent to-cyber-blue text-white shadow-lg shadow-purple-accent/30"
                          : "bg-white/[0.05] text-muted"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-white">
                          {item.label}
                        </span>
                        {item.price && (
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                              item.highlight
                                ? "bg-purple-accent/20 text-purple-accent"
                                : "bg-white/[0.06] text-muted"
                            }`}
                          >
                            {item.price}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Step 2 extra: language + prompt hint */}
              {stepIdx === 1 && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <Layers className="w-3.5 h-3.5" />
                    <span>语言：简体中文</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <p className="text-xs text-muted/70">
                      提示词输入框（可选）— 描述你想要的风格、氛围和特殊要求
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3 extra: upload hint */}
              {stepIdx === 2 && (
                <div className="mt-4 p-4 rounded-xl bg-[#030014]/50 border border-white/[0.04]">
                  <p className="text-xs text-muted/80 leading-relaxed">
                    图片越清晰、角度越完整，生成结果越贴近实物
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-purple-accent" />
                    <span className="text-xs font-medium text-purple-accent">
                      拖拽图片到此处或点击上传
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="mt-12 text-center"
        >
          <p className="text-xs text-muted/60 mb-4">
            一次生成即得 9 张精选图
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="relative inline-flex items-center gap-2.5 px-10 py-4 text-base font-semibold text-white rounded-2xl overflow-hidden group shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-accent via-cyber-blue to-purple-accent bg-[length:200%_100%] animate-shimmer" />
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              立即生成 (消耗 199 积分)
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
