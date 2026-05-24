"use client";

import { motion } from "framer-motion";
import { Flame, Gift, Zap, CheckCircle } from "lucide-react";

export function PromoSection() {
  return (
    <section id="pricing" className="relative py-24 px-6">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500/15 to-red-500/10 border border-orange-500/20 mb-6">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-bold text-orange-400 tracking-wide">
              限时特惠
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Pixora 专业版限时优惠
          </h2>
        </motion.div>

        {/* Promo cards */}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Standard plan */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ y: -4 }}
            className="glass-card-hover rounded-3xl p-6 sm:p-8"
          >
            <Zap className="w-8 h-8 text-purple-accent mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">标准极速</h3>
            <p className="text-sm text-muted mb-6">
              快速出图 · 适合批量生成
            </p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl font-bold text-gradient-static">199</span>
              <span className="text-sm text-muted">积分起</span>
            </div>
            <p className="text-xs text-muted/60">一次生成 9 张图</p>
          </motion.div>

          {/* PRO plan with promo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ y: -4 }}
            className="relative glass-card-hover rounded-3xl p-6 sm:p-8 overflow-hidden"
          >
            {/* Promo glow background */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-purple-accent/10 blur-3xl pointer-events-none" />

            {/* Badge */}
            <div className="absolute top-4 right-4">
              <div className="promo-pulse px-3 py-1 rounded-full bg-gradient-to-r from-purple-accent to-cyber-blue text-xs font-bold text-white">
                2.5 折特惠
              </div>
            </div>

            <Gift className="w-8 h-8 text-purple-accent mb-4 relative z-10" />
            <h3 className="text-lg font-semibold text-white mb-2 relative z-10">
              PRO 增强
            </h3>
            <p className="text-sm text-muted mb-6 relative z-10">
              高画质精品 · 细节增强
            </p>

            <div className="relative z-10">
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-3xl font-bold text-gradient-static">199</span>
                <span className="text-sm text-muted">+ 99</span>
              </div>

              <div className="space-y-2 mb-6">
                {[
                  "赠送水印解锁 (立省 100 积分)",
                  "PRO 增强画质算法",
                  "优先处理队列",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-accent shrink-0" />
                    <span className="text-sm text-muted">{benefit}</span>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-purple-accent to-cyber-blue shadow-lg shadow-purple-accent/25"
              >
                立即开通 PRO
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
