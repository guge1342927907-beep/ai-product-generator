"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

export function FeatureCard({ icon: Icon, title, description, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: "easeOut" }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      className="group relative p-8 rounded-3xl backdrop-blur-md bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500"
    >
      {/* Hover glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-accent/5 to-cyber-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Icon */}
      <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-accent/20 to-cyber-blue/20 border border-purple-accent/20 flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-purple-accent/20 transition-shadow duration-500">
        <Icon className="w-6 h-6 text-purple-accent" />
      </div>

      <h3 className="relative text-lg font-semibold text-white tracking-tight mb-3">
        {title}
      </h3>
      <p className="relative text-sm text-muted leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
