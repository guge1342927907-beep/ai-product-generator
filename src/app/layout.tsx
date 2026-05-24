import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { FloatingActions } from "@/components/FloatingActions";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pixora — AI Product Image Generator",
  description:
    "Generate stunning, studio-quality product images with AI. Upload a photo, pick a style, and get photorealistic results in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} h-full`}>
      <body className="font-sans min-h-full bg-background text-foreground antialiased">
        {children}
        <FloatingActions />
      </body>
    </html>
  );
}
