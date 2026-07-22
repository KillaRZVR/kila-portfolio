"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const pieces = [
  { position: "left-[14%] top-[16%] size-[35%]", delay: 0 },
  { position: "left-[36%] top-[28%] size-[43%]", delay: 0.2, accent: true },
  { position: "right-[7%] top-[40%] size-[30%]", delay: 0.4 },
  { position: "left-[38%] bottom-[5%] size-[27%]", delay: 0.6 },
];

export function HeroArtifact() {
  const reduceMotion = useReducedMotion();
  const [allowAmbientMotion, setAllowAmbientMotion] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => setAllowAmbientMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const shouldAnimate = allowAmbientMotion && !reduceMotion;
  return (
    <div className="relative aspect-square w-full max-w-[30rem]" aria-hidden="true">
      <div className="absolute inset-[9%] rounded-full bg-[#f5c2c8]/[0.045] blur-[84px]" />
      <motion.div initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }} className="relative size-full">
        {pieces.map((piece, index) => (
          <motion.div key={index} className={`absolute rotate-45 border ${piece.position} ${piece.accent ? "border-[#f5c2c8]/70 bg-[#f5c2c8]/[0.08]" : "border-[#e4dfda]/30 bg-[#e4dfda]/[0.015]"}`} animate={shouldAnimate ? { y: [0, -4 - index, 0], rotate: [45, 48, 45] } : undefined} transition={{ duration: 8.5 + index * 0.8, delay: piece.delay, repeat: Infinity, ease: "easeInOut" }} />
        ))}
        <motion.div className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f5c2c8]/80" animate={shouldAnimate ? { scale: [1, 1.35, 1], opacity: [0.7, 0.35, 0.7] } : undefined} transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }} />
      </motion.div>
    </div>
  );
}
