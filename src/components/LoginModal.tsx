"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  initialMode: "login" | "register";
  onClose: () => void;
}

export function LoginModal({ isOpen, initialMode, onClose }: LoginModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative w-full max-w-md rounded-2xl border border-white/[0.1] bg-[#0c0824]/90 backdrop-blur-xl shadow-2xl shadow-purple-accent/10"
          >
            {/* Ambient glow behind modal */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-purple-accent/10 via-cyber-blue/5 to-purple-accent/5 blur-xl -z-10" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-muted hover:text-white hover:bg-white/[0.06] transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="pt-10 px-8 pb-2 text-center">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                欢迎来到 AI-Species
              </h2>
              <p className="mt-2 text-sm text-muted">
                登录或注册以开始您的 AI 创作之旅
              </p>
            </div>

            {/* Tab switcher */}
            <div className="mt-6 mx-8 flex p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
              <button
                onClick={() => setMode("login")}
                className={`relative flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-300 ${
                  mode === "login" ? "text-white" : "text-muted hover:text-white"
                }`}
              >
                {mode === "login" && (
                  <motion.div
                    layoutId="login-tab-bg"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-accent to-cyber-blue opacity-90"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">登录</span>
              </button>
              <button
                onClick={() => setMode("register")}
                className={`relative flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-300 ${
                  mode === "register" ? "text-white" : "text-muted hover:text-white"
                }`}
              >
                {mode === "register" && (
                  <motion.div
                    layoutId="login-tab-bg"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-accent to-cyber-blue opacity-90"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">注册</span>
              </button>
            </div>

            {/* Form fields */}
            <div className="px-8 py-6 flex flex-col gap-4">
              {mode === "register" ? (
                <>
                  {/* QQ号 */}
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm select-none">
                      📧
                    </span>
                    <input
                      type="text"
                      placeholder="QQ号"
                      className="w-full pl-11 pr-4 py-3 text-sm text-white placeholder-muted/50 bg-white/[0.04] border border-white/[0.08] rounded-xl focus:outline-none focus:border-purple-accent/50 focus:bg-white/[0.06] transition-all duration-200"
                    />
                  </div>

                  {/* 验证码 + 发送按钮 */}
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm select-none">
                        🔢
                      </span>
                      <input
                        type="text"
                        placeholder="6位验证码"
                        className="w-full pl-11 pr-4 py-3 text-sm text-white placeholder-muted/50 bg-white/[0.04] border border-white/[0.08] rounded-xl focus:outline-none focus:border-purple-accent/50 focus:bg-white/[0.06] transition-all duration-200"
                      />
                    </div>
                    <button className="shrink-0 px-4 py-3 text-xs font-semibold text-white rounded-xl bg-gradient-to-r from-purple-accent/80 to-cyber-blue/80 hover:from-purple-accent hover:to-cyber-blue transition-all duration-200">
                      发送验证码
                    </button>
                  </div>

                  {/* 用户名 */}
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm select-none">
                      👤
                    </span>
                    <input
                      type="text"
                      placeholder="用户名 (6-12位，字母开头，可含数字和下划线)"
                      className="w-full pl-11 pr-4 py-3 text-sm text-white placeholder-muted/50 bg-white/[0.04] border border-white/[0.08] rounded-xl focus:outline-none focus:border-purple-accent/50 focus:bg-white/[0.06] transition-all duration-200"
                    />
                  </div>

                  {/* 密码 */}
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm select-none">
                      🔒
                    </span>
                    <input
                      type="password"
                      placeholder="密码 (至少6位)"
                      className="w-full pl-11 pr-4 py-3 text-sm text-white placeholder-muted/50 bg-white/[0.04] border border-white/[0.08] rounded-xl focus:outline-none focus:border-purple-accent/50 focus:bg-white/[0.06] transition-all duration-200"
                    />
                  </div>

                  {/* 邀请码 */}
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm select-none">
                      🎁
                    </span>
                    <input
                      type="text"
                      placeholder="邀请码 (可选)"
                      className="w-full pl-11 pr-4 py-3 text-sm text-white placeholder-muted/50 bg-white/[0.04] border border-white/[0.08] rounded-xl focus:outline-none focus:border-purple-accent/50 focus:bg-white/[0.06] transition-all duration-200"
                    />
                  </div>

                  {/* Submit button */}
                  <button className="w-full mt-2 py-3.5 text-base font-semibold text-white rounded-xl bg-gradient-to-r from-purple-accent via-[#a855f7] to-[#ec4899] hover:opacity-90 transition-all duration-200 shadow-lg shadow-purple-accent/25">
                    注册并登录 →
                  </button>
                </>
              ) : (
                <>
                  {/* 邮箱或用户名 */}
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm select-none">
                      👤
                    </span>
                    <input
                      type="text"
                      placeholder="邮箱或用户名"
                      className="w-full pl-11 pr-4 py-3 text-sm text-white placeholder-muted/50 bg-white/[0.04] border border-white/[0.08] rounded-xl focus:outline-none focus:border-purple-accent/50 focus:bg-white/[0.06] transition-all duration-200"
                    />
                  </div>

                  {/* 密码 */}
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm select-none">
                      🔒
                    </span>
                    <input
                      type="password"
                      placeholder="密码"
                      className="w-full pl-11 pr-4 py-3 text-sm text-white placeholder-muted/50 bg-white/[0.04] border border-white/[0.08] rounded-xl focus:outline-none focus:border-purple-accent/50 focus:bg-white/[0.06] transition-all duration-200"
                    />
                  </div>

                  {/* Submit button */}
                  <button className="w-full mt-2 py-3.5 text-base font-semibold text-white rounded-xl bg-gradient-to-r from-purple-accent via-[#a855f7] to-[#ec4899] hover:opacity-90 transition-all duration-200 shadow-lg shadow-purple-accent/25">
                    登录 →
                  </button>

                  {/* Forgot password */}
                  <p className="text-center">
                    <button className="text-xs text-muted/60 hover:text-purple-accent transition-colors duration-200">
                      忘记密码？
                    </button>
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
