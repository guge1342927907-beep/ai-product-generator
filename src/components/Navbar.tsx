"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Menu, X } from "lucide-react";
import Link from "next/link";
import { LoginModal } from "@/components/LoginModal";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Showcase", href: "#showcase" },
  { label: "Pricing", href: "#pricing" },
  { label: "使用教程", href: "#tutorial" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginMode, setLoginMode] = useState<"login" | "register">("login");

  const openLogin = (mode: "login" | "register") => {
    setLoginMode(mode);
    setLoginOpen(true);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl bg-[#030014]/70 border-b border-white/[0.06] shadow-[0_1px_40px_rgba(139,92,246,0.06)]"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-purple-accent to-cyber-blue flex items-center justify-center shadow-lg shadow-purple-accent/25 group-hover:shadow-purple-accent/40 transition-shadow duration-300">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">
            Pixora
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative px-4 py-2 text-sm text-muted hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/[0.04]"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop right section */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Login */}
          <button
            onClick={() => openLogin("login")}
            className="px-4 py-2 text-sm text-muted hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/[0.04]"
          >
            登录
          </button>

          {/* Primary CTA */}
          <Link
            href="/generate"
            className="relative inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-accent via-cyber-blue to-purple-accent bg-[length:200%_100%] animate-shimmer opacity-90" />
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              创建您的作品
            </span>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-muted hover:text-white transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden border-t border-white/[0.06] backdrop-blur-xl bg-[#030014]/90"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-sm text-muted hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  openLogin("login");
                }}
                className="py-2.5 text-sm text-muted hover:text-white transition-colors"
              >
                登录 / 注册
              </button>
              <Link
                href="/generate"
                onClick={() => setMobileOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-purple-accent to-cyber-blue shadow-lg shadow-purple-accent/25"
              >
                <Sparkles className="w-4 h-4" />
                创建您的作品
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LoginModal
        isOpen={loginOpen}
        initialMode={loginMode}
        onClose={() => setLoginOpen(false)}
      />
    </motion.header>
  );
}
