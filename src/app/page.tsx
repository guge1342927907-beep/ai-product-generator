import { Navbar } from "@/components/Navbar";
import { GlowOrb } from "@/components/GlowOrb";
import { Hero } from "@/components/Hero";
import { GenerationSteps } from "@/components/GenerationSteps";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { PromoSection } from "@/components/PromoSection";
import { CTAFooter } from "@/components/CTAFooter";

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Ambient glows */}
      <GlowOrb
        color="rgba(139, 92, 246, 0.15)"
        className="top-0 -left-20"
        size={700}
      />
      <GlowOrb
        color="rgba(6, 182, 212, 0.1)"
        className="top-1/3 -right-32"
        size={500}
      />
      <GlowOrb
        color="rgba(139, 92, 246, 0.08)"
        className="-bottom-32 left-1/3"
        size={600}
      />
      <GlowOrb
        color="rgba(6, 182, 212, 0.06)"
        className="top-2/3 left-1/2"
        size={400}
      />

      {/* Grid background */}
      <div className="fixed inset-0 bg-grid pointer-events-none" />

      {/* Content */}
      <Navbar />
      <main>
        <Hero />
        <GenerationSteps />
        <BeforeAfterSlider />
        <PromoSection />
        <CTAFooter />
      </main>
    </div>
  );
}
