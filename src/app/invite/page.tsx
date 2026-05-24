"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Gift,
  Heart,
  Crown,
  Copy,
  Check,
  UserPlus,
  Share2,
  UserCheck,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { GlowOrb } from "@/components/GlowOrb";
import { Sidebar } from "@/components/Sidebar";
import { ScrollToTop } from "@/components/ScrollToTop";

export default function InvitePage() {
  const [copied, setCopied] = useState(false);
  const inviteCode = "PIXORA-XXXXXX";

  const handleCopy = () => {
    navigator.clipboard?.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    { icon: Copy, title: "复制邀请码", desc: "点击上方复制按钮获取专属邀请码" },
    { icon: Share2, title: "分享给好友", desc: "通过微信 / 朋友圈 / 链接分享给好友" },
    { icon: UserPlus, title: "好友注册", desc: "好友使用你的邀请码注册 Pixora" },
    { icon: Sparkles, title: "好友首次生图", desc: "好友完成首次生图后双方各得 200 积分" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <GlowOrb color="rgba(139, 92, 246, 0.10)" className="top-0 left-1/4" size={500} />
      <GlowOrb color="rgba(6, 182, 212, 0.05)" className="top-1/3 -right-16" size={380} />
      <GlowOrb color="rgba(139, 92, 246, 0.06)" className="-bottom-24 left-1/2" size={480} />

      <div className="fixed inset-0 bg-grid pointer-events-none" />

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
                <Link href="/" className="flex items-center gap-1.5 text-sm text-muted hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  返回首页
                </Link>
                <div className="w-px h-4 bg-white/[0.08]" />
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-accent to-cyber-blue flex items-center justify-center shadow-md shadow-purple-accent/25">
                    <Gift className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h1 className="text-xl font-semibold tracking-tight text-white">邀请好友送积分</h1>
                </div>
              </div>
              <p className="text-sm text-muted ml-[132px]">
                邀请好友注册，好友得 200 积分，好友首次生图后你也将获得奖励积分
              </p>
            </motion.div>

            {/* ─── Reward cards ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
              className="grid sm:grid-cols-3 gap-4 mb-6"
            >
              {[
                { icon: Gift, color: "from-amber-500/20 to-orange-500/10", border: "border-amber-400/20", iconColor: "text-amber-400", title: "好友奖励", desc: "好友使用你的邀请码注册，额外获得 200 积分" },
                { icon: Heart, color: "from-pink-500/20 to-rose-500/10", border: "border-pink-400/20", iconColor: "text-pink-400", title: "邀请奖励", desc: "好友首次生图后，你获得 200 积分 + 每日 5 位正常奖励" },
                { icon: Crown, color: "from-purple-accent/20 to-cyber-blue/10", border: "border-purple-accent/20", iconColor: "text-purple-accent", title: "成为代理", desc: "超出每日上限仅得 1 积分，联系管理员获取代理身份" },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -3 }}
                  className={`rounded-2xl border ${card.border} bg-gradient-to-b ${card.color} backdrop-blur-md p-5`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center mb-3`}>
                    <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                  </div>
                  <p className="text-sm font-semibold text-white mb-1.5">{card.title}</p>
                  <p className="text-xs text-muted/70 leading-relaxed">{card.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* ─── Invite code ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-6 mb-6"
            >
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">我的邀请码</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 px-5 py-3.5 rounded-xl border border-white/[0.08] bg-white/[0.03]">
                  <span className="text-lg font-bold text-white tracking-[0.2em]">{inviteCode}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    copied
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-400/30"
                      : "bg-gradient-to-r from-purple-accent to-cyber-blue text-white shadow-lg shadow-purple-accent/20"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      复制邀请码
                    </>
                  )}
                </motion.button>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <div className="flex-1 px-5 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">邀请统计</span>
                    <span className="text-lg font-bold text-white">0 <span className="text-sm font-normal text-muted/50">人</span></span>
                  </div>
                </div>
                <div className="text-xs text-muted/50">已成功邀请的好友数量</div>
              </div>
            </motion.div>

            {/* ─── Steps ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-6"
            >
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">如何邀请好友？</p>
              <div className="grid sm:grid-cols-4 gap-3">
                {steps.map((step, i) => (
                  <div key={i} className="relative text-center group">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-3 group-hover:bg-white/[0.08] group-hover:border-purple-accent/30 transition-all duration-300">
                      <step.icon className="w-5 h-5 text-muted/50 group-hover:text-purple-accent transition-colors duration-300" />
                    </div>
                    <p className="text-xs font-semibold text-white mb-1">{step.title}</p>
                    <p className="text-[11px] text-muted/50 leading-relaxed">{step.desc}</p>
                    {i < steps.length - 1 && (
                      <div className="hidden sm:block absolute top-6 -right-2 text-muted/20">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
      <ScrollToTop />
    </div>
  );
}
