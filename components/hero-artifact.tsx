"use client";

import { motion } from "framer-motion";

const pieces = [
  { position: "left-[14%] top-[16%] size-[35%]", delay: 0 },
  { position: "left-[36%] top-[28%] size-[43%]", delay: 0.15, accent: true },
  { position: "right-[7%] top-[40%] size-[30%]", delay: 0.3 },
  { position: "left-[38%] bottom-[5%] size-[27%]", delay: 0.45 },
];

export function HeroArtifact() {
  return (
    <div className="relative aspect-square w-full max-w-[30rem]" aria-hidden="true">
      <div className="absolute inset-[5%] rounded-full bg-[#f5c2c8]/[0.08] blur-[76px]" />
      <motion.div
        initial={{ opacity: 0, scale: 0.76, rotate: -7 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative size-full"
      >
        {pieces.map((piece, index) => (
          <motion.div
            key={index}
            className={`absolute rotate-45 border ${piece.position} ${piece.accent ? "border-[#f5c2c8] bg-[#f5c2c8]/15" : "border-[#e4dfda]/55 bg-[#e4dfda]/[0.025]"}`}
            animate={{ y: [0, -10 - index * 2, 0], rotate: [45, 49, 45] }}
            transition={{ duration: 4.6 + index * 0.55, delay: piece.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
        <motion.div
          className="absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f5c2c8]"
          animate={{ scale: [1, 1.8, 1], opacity: [0.9, 0.35, 0.9] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}