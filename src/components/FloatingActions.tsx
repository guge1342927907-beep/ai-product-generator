"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Headset } from "lucide-react";
import { InviteModal } from "@/components/InviteModal";

export function FloatingActions() {
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
        {/* Invite rebate */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setInviteOpen(true)}
          className="relative group"
          title="邀请返利 50%"
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-accent to-cyber-blue flex items-center justify-center shadow-lg shadow-purple-accent/30 group-hover:shadow-purple-accent/50 transition-shadow duration-300">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 text-xs font-semibold text-white bg-[#0f0a2e]/95 border border-white/[0.1] rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none backdrop-blur-xl">
            邀请返利 50%
          </span>
        </motion.button>

        {/* Customer service */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="relative group"
          title="客服"
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyber-blue to-blue-500 flex items-center justify-center shadow-lg shadow-cyber-blue/30 group-hover:shadow-cyber-blue/50 transition-shadow duration-300">
            <Headset className="w-5 h-5 text-white" />
          </div>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 text-xs font-semibold text-white bg-[#0f0a2e]/95 border border-white/[0.1] rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none backdrop-blur-xl">
            客服
          </span>
        </motion.button>
      </div>

      <InviteModal isOpen={inviteOpen} onClose={() => setInviteOpen(false)} />
    </>
  );
}
