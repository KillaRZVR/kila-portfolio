"use client";

import { motion } from "framer-motion";

const pieces = [
  { x: -58, y: 4, size: 58, delay: 0 },
  { x: 0, y: -32, size: 76, delay: 0.15 },
  { x: 62, y: 10, size: 50, delay: 0.3 },
  { x: 6, y: 42, size: 54, delay: 0.45 },
];

export function HeroArtifact() {
  return (
    <div className="relative flex min-h-[24vh] items-center justify-center sm:min-h-[30vh]" aria-hidden="true">
      <div className="absolute size-[15rem] rounded-full bg-[#f5c2c8]/[0.08] blur-[72px] sm:size-[22rem]" />
      <motion.div initial={{ opacity: 0, scale: 0.72, rotate: -8 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} className="relative size-52 sm:size-64">
        {pieces.map((piece, index) => (
          <motion.div key={index} className="absolute left-1/2 top-1/2" style={{ width: piece.size, height: piece.size, marginLeft: -piece.size / 2, marginTop: -piece.size / 2, x: piece.x, y: piece.y }} animate={{ translateY: [piece.y, piece.y - 9, piece.y], rotate: [45, 49, 45] }} transition={{ duration: 4.8 + index * 0.45, delay: piece.delay, repeat: Infinity, ease: "easeInOut" }}>
            <div className={`size-full rotate-45 border ${index === 1 ? "border-[#f5c2c8] bg-[#f5c2c8]/20" : "border-[#e4dfda]/70 bg-[#e4dfda]/[0.04]"}`} />
          </motion.div>
        ))}
        <motion.div className="absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f5c2c8]" animate={{ scale: [1, 1.8, 1], opacity: [0.9, 0.35, 0.9] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }} />
      </motion.div>
    </div>
  );
}
