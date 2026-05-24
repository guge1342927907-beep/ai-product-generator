"use client";

import { motion } from "framer-motion";
import { Image, Users, Video } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

const features = [
  {
    icon: Image,
    title: "AI Background Generator",
    description:
      "Instantly replace backgrounds with photorealistic studio setups, lifestyle scenes, or custom environments — no green screen needed.",
  },
  {
    icon: Users,
    title: "AI Model Try-On",
    description:
      "Showcase your apparel on diverse AI-generated models. Choose body types, poses, and expressions that match your brand.",
  },
  {
    icon: Video,
    title: "AI Product Video",
    description:
      "Transform static product images into cinematic 360-degree spin videos with dynamic lighting and smooth camera motion.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-32 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold tracking-[0.2em] text-purple-accent uppercase mb-4">
            Capabilities
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Everything you need to{" "}
            <span className="text-gradient-static">sell more</span>
          </h2>
          <p className="mt-4 text-muted text-base max-w-lg mx-auto">
            From backgrounds to video — one platform, infinite creative
            possibilities for your product catalog.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
