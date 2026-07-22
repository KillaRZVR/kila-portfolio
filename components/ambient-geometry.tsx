"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const floatingShapes = [
  { className: "left-[4%] top-[12%] size-20 rotate-45 border-[#f5c2c8]/20 bg-[#f5c2c8]/[0.02] sm:size-28", x: 6, y: -6, duration: 15 },
  { className: "right-[6%] top-[39%] size-14 rotate-12 border-[#e4dfda]/15 bg-[#e4dfda]/[0.012] sm:size-20", x: -5, y: 7, duration: 18 },
  { className: "left-[5%] top-[67%] hidden h-12 w-28 -rotate-12 border-[#f5c2c8]/15 bg-[#f5c2c8]/[0.012] md:block sm:h-16 sm:w-40", x: 8, y: -4, duration: 16 },
  { className: "right-[9%] top-[88%] hidden size-20 rotate-45 border-[#e4dfda]/15 bg-[#e4dfda]/[0.01] md:block sm:size-28", x: -6, y: 5, duration: 14 },
];

export function AmbientGeometry() {
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
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute left-[-10rem] top-[30%] size-[24rem] rounded-full bg-[#f5c2c8]/[0.025] blur-[110px]" />
      <div className="absolute right-[-12rem] top-[68%] size-[30rem] rounded-full bg-[#f5c2c8]/[0.028] blur-[130px]" />
      {floatingShapes.map((shape) => (
        <motion.div key={shape.className} className={`absolute border opacity-70 ${shape.className}`} initial={false} animate={shouldAnimate ? { x: [0, shape.x, 0], y: [0, shape.y, 0] } : undefined} transition={{ duration: shape.duration, repeat: Infinity, ease: "easeInOut" }} />
      ))}
      <motion.div className="absolute right-[-3rem] top-[20%] hidden size-56 opacity-35 md:block" animate={shouldAnimate ? { rotate: 360 } : undefined} transition={{ duration: 42, repeat: Infinity, ease: "linear" }}>
        <div className="absolute inset-[15%] rotate-45 border border-[#f5c2c8]/20 bg-[#f5c2c8]/[0.015]" />
        <div className="absolute inset-[32%] border border-[#e4dfda]/15" />
        <div className="absolute inset-[5%] rounded-full border border-[#f5c2c8]/10"><span className="absolute left-1/2 top-[-2px] size-1 -translate-x-1/2 rounded-full bg-[#f5c2c8]/60" /></div>
      </motion.div>
      <motion.div className="absolute left-[-4rem] top-[72%] hidden size-64 opacity-30 md:block" animate={shouldAnimate ? { y: [0, -6, 0] } : undefined} transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}>
        <div className="absolute inset-[18%] rotate-45 border border-[#f5c2c8]/18 bg-[#f5c2c8]/[0.012]" />
        <div className="absolute inset-[36%] rounded-full border border-[#e4dfda]/12" />
      </motion.div>
      <motion.div className="absolute left-[12%] top-[55%] hidden h-px w-40 origin-left bg-gradient-to-r from-[#f5c2c8]/25 to-transparent md:block" animate={shouldAnimate ? { opacity: [0.25, 0.5, 0.25] } : undefined} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />
    </div>
  );
}
