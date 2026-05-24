"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Image,
  Copy,
  Wand2,
  Video,
  FileText,
  Shield,
  Scissors,
  FolderOpen,
  ListTodo,
  Coins,
  ReceiptText,
  Headset,
  Gift,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import Link from "next/link";
import { LoginModal } from "@/components/LoginModal";

/* ─── Menu data ─── */

interface MenuItem {
  icon: typeof Image;
  label: string;
  href: string;
  badge?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    title: "AI 创作",
    items: [
      { icon: Image, label: "AI 生图", href: "/generate" },
      { icon: Copy, label: "AI 克隆图片", href: "/clone" },
      { icon: Wand2, label: "DIY 自由生图", href: "/diy" },
      { icon: Video, label: "AI 视频", href: "/video", badge: "NEW" },
      { icon: FileText, label: "智能商品描述", href: "/describe" },
    ],
  },
  {
    title: "图片工具",
    items: [
      { icon: Shield, label: "水印模板", href: "/watermark" },
      { icon: Scissors, label: "智能去水印", href: "/removewatermark" },
    ],
  },
  {
    title: "我的",
    items: [
      { icon: FolderOpen, label: "我的作品", href: "/works" },
      { icon: ListTodo, label: "任务队列", href: "/tasks" },
    ],
  },
  {
    title: "账户",
    items: [
      { icon: Coins, label: "积分流水", href: "/points" },
      { icon: ReceiptText, label: "充值记录", href: "/recharge" },
      { icon: Headset, label: "售后记录", href: "/aftersales" },
      { icon: Gift, label: "邀请赚积分", href: "/invite" },
    ],
  },
];

/* ─── Component ─── */

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("AI 生图");
  const [loginOpen, setLoginOpen] = useState(false);

  /* Build a flat href → label map from all menu sections */
  const hrefToLabel = useMemo(() => {
    const map: Record<string, string> = {};
    for (const section of menuSections) {
      for (const item of section.items) {
        if (item.href !== "#") {
          map[item.href] = item.label;
        }
      }
    }
    return map;
  }, []);

  /* Sync activeItem with the current route */
  useEffect(() => {
    const label = hrefToLabel[pathname];
    if (label) {
      setActiveItem(label);
    }
  }, [pathname, hrefToLabel]);

  return (
    <>
      {/* Mobile toggle FAB */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="lg:hidden fixed bottom-6 left-4 z-50 w-11 h-11 rounded-xl bg-purple-accent flex items-center justify-center shadow-lg shadow-purple-accent/30"
      >
        {collapsed ? (
          <ChevronRight className="w-5 h-5 text-white" />
        ) : (
          <ChevronLeft className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
            onClick={() => setCollapsed(true)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <aside
        className={`
          h-screen flex flex-col
          border-r border-white/[0.06]
          bg-gradient-to-b from-[#0c0824]/95 via-[#0a0620]/95 to-[#08041a]/95
          backdrop-blur-2xl
          overflow-hidden
          transition-all duration-300 ease-out

          /* Mobile: fixed overlay */
          fixed top-0 left-0 z-40 w-[260px] pt-6 pb-6
          ${collapsed ? "-translate-x-full" : "translate-x-0"}

          /* Desktop: fixed, never scrolls */
          lg:fixed lg:top-0 lg:left-0 lg:z-30 lg:translate-x-0
          ${collapsed ? "lg:w-[64px]" : "lg:w-[250px]"}
        `}
      >
        {/* ── Logo ── */}
        {/* ── Logo ── */}
        <div className={`
          flex items-center px-5 mb-6
          ${collapsed ? "lg:justify-center lg:px-0" : ""}
        `}>
          <Link
            href="/"
            className="flex items-center gap-2.5 group shrink-0"
          >
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-purple-accent to-cyber-blue flex items-center justify-center shadow-lg shadow-purple-accent/25 group-hover:shadow-purple-accent/40 transition-shadow duration-300">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span
              className={`text-base font-semibold tracking-tight text-white whitespace-nowrap transition-opacity duration-200 ${
                collapsed ? "lg:hidden" : ""
              }`}
            >
              Pixora
            </span>
          </Link>
        </div>

        {/* Desktop collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`
            hidden lg:flex absolute top-6 right-0 translate-x-1/2
            w-5 h-5 rounded-full
            bg-white/[0.1] border border-white/[0.12]
            items-center justify-center
            text-muted hover:text-white hover:bg-white/[0.18] hover:border-white/[0.2]
            transition-all duration-200
            z-10
          `}
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>

        {/* ── Menu sections ── */}
        <div className="flex-1 px-3 space-y-5 overflow-y-auto">
          {menuSections.map((section) => (
            <div key={section.title}>
              {/* Section title — hidden when collapsed on desktop */}
              <p
                className={`mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted/50 ${
                  collapsed ? "lg:hidden" : ""
                }`}
              >
                {section.title}
              </p>

              <div className="flex flex-col gap-1">
                {section.items.map((item) => {
                  const isActive = activeItem === item.label;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setActiveItem(item.label)}
                      title={collapsed ? item.label : undefined}
                      className={`
                        relative flex items-center gap-3
                        text-sm rounded-xl
                        transition-all duration-200 group
                        ${
                          collapsed
                            ? "lg:justify-center lg:px-0 lg:py-3 lg:w-10 lg:mx-auto"
                            : "px-3 py-2.5"
                        }
                        ${
                          isActive
                            ? "text-white"
                            : "text-muted hover:text-white hover:bg-white/[0.04]"
                        }
                      `}
                    >
                      {/* Active background — solid gradient fill */}
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-accent/80 to-cyber-blue/60 shadow-lg shadow-purple-accent/25"
                          transition={{
                            type: "spring",
                            bounce: 0.15,
                            duration: 0.5,
                          }}
                        />
                      )}
                      <item.icon
                        className={`w-4 h-4 relative z-10 shrink-0 transition-colors duration-200 ${
                          isActive
                            ? "text-white"
                            : "text-muted/50 group-hover:text-muted"
                        }`}
                      />
                      <span
                        className={`relative z-10 font-medium whitespace-nowrap ${
                          collapsed ? "lg:hidden" : ""
                        }`}
                      >
                        {item.label}
                      </span>
                      {item.badge && (
                        <span
                          className={`
                            relative z-10
                            text-[10px] font-bold
                            bg-purple-accent/20 text-purple-accent
                            px-1.5 py-0.5 rounded-md
                            border border-purple-accent/30
                            ${collapsed ? "lg:hidden" : "ml-auto"}
                          `}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom section ── */}
        <div className={`
          px-3 mt-3 space-y-3
          ${collapsed ? "lg:px-1.5" : ""}
        `}>
          {/* Tutorial link */}
          <Link
            href="#"
            title={collapsed ? "使用教程" : undefined}
            className={`
              flex items-center gap-3 text-sm text-muted
              hover:text-white hover:bg-white/[0.04]
              rounded-xl transition-all duration-200
              ${collapsed ? "lg:justify-center lg:px-0 lg:py-2.5 lg:w-10 lg:mx-auto" : "px-3 py-2.5"}
            `}
          >
            <BookOpen className="w-4 h-4 text-muted/50 shrink-0" />
            <span className={`font-medium ${collapsed ? "lg:hidden" : ""}`}>
              使用教程
            </span>
          </Link>

          {/* User section */}
          <div
            className={`
              rounded-xl bg-white/[0.03] border border-white/[0.06]
              transition-all duration-200
              ${collapsed ? "lg:p-2" : "p-3"}
            `}
          >
            <div
              className={`
                flex items-center gap-3
                ${collapsed ? "lg:justify-center lg:mb-0" : "mb-3"}
              `}
            >
              <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-muted/50" />
              </div>
              <span className={`text-sm text-muted ${collapsed ? "lg:hidden" : ""}`}>
                未登录
              </span>
            </div>
            <button
              onClick={() => setLoginOpen(true)}
              className={`
                w-full py-2.5 text-sm font-semibold text-white
                rounded-lg
                bg-gradient-to-r from-purple-accent to-cyber-blue
                hover:opacity-90 transition-all duration-200
                shadow-lg shadow-purple-accent/20
                ${collapsed ? "lg:hidden" : ""}
              `}
            >
              登录 / 注册
            </button>
          </div>
        </div>

        {/* Bottom fade overlay */}
        <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-[#08041a]/95 to-transparent pointer-events-none" />
      </aside>

      {/* Desktop spacer — preserves sidebar width in flex layout */}
      <div
        className={`hidden lg:block shrink-0 transition-all duration-300 ease-out ${
          collapsed ? "lg:w-[64px]" : "lg:w-[250px]"
        }`}
      />

      {/* Login modal */}
      <LoginModal
        isOpen={loginOpen}
        initialMode="login"
        onClose={() => setLoginOpen(false)}
      />
    </>
  );
}
