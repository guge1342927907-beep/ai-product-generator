"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTAFooter() {
  return (
    <section className="relative py-32 px-6">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            准备好让你的
            <br />
            <span className="text-gradient">产品图变身</span>了吗？
          </h2>
          <p className="mt-4 text-base text-muted max-w-md mx-auto">
            已有 3 万+ 商家使用 Pixora 生成专业电商主图
          </p>
          <div className="mt-10">
            <Link
              href="/generate"
              className="group relative inline-flex items-center gap-2.5 px-10 py-4 text-base font-semibold text-white rounded-2xl bg-gradient-to-r from-purple-accent via-cyber-blue to-purple-accent bg-[length:200%_100%] hover:bg-right transition-all duration-500 shadow-xl shadow-purple-accent/25 hover:shadow-purple-accent/40 hover:scale-[1.02]"
            >
              <Sparkles className="w-5 h-5" />
              开始免费生成
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted/60">
            无需信用卡 · 注册即获 10 次免费生成
          </p>
        </motion.div>

        <div className="mt-24 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted/50">
            &copy; 2026 Pixora. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["隐私政策", "服务条款", "联系我们"].map((label) => (
              <a
                key={label}
                href="#"
                className="text-xs text-muted/50 hover:text-muted transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
