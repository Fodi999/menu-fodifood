"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  color?: string;
}

export function InteractiveCard({ title, description, icon, href, color = "orange" }: Props) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.05, rotateY: 5 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className={`relative bg-gradient-to-br from-[#151515] to-[#0a0a0a] border border-gray-800/50 rounded-2xl p-8 shadow-xl cursor-pointer hover:border-${color}-500/40 hover:shadow-${color}-500/10 transition-all duration-300 h-full`}
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className={`text-${color}-400`}
          >
            {icon}
          </motion.div>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>
      </motion.div>
    </Link>
  );
}
