"use client";

import { motion, useReducedMotion } from "framer-motion";

const floatingShapes = [
  {
    className: "left-[3%] top-[12%] size-20 rotate-45 border-[#f5c2c8]/35 bg-[#f5c2c8]/[0.035] sm:size-28",
    x: 12,
    y: -18,
    rotate: 8,
    duration: 8.5,
  },
  {
    className: "right-[5%] top-[25%] h-24 w-10 rotate-12 border-[#e4dfda]/25 bg-[#e4dfda]/[0.02] sm:h-36 sm:w-14",
    x: -10,
    y: 20,
    rotate: -7,
    duration: 10.5,
  },
  {
    className: "left-[8%] top-[39%] size-12 rotate-45 border-[#e4dfda]/30 bg-[#e4dfda]/[0.02] sm:size-16",
    x: 8,
    y: -14,
    rotate: 11,
    duration: 7.5,
  },
  {
    className: "right-[4%] top-[51%] size-24 rotate-45 border-[#f5c2c8]/30 bg-[#f5c2c8]/[0.025] sm:size-36",
    x: -14,
    y: 18,
    rotate: 6,
    duration: 11.5,
  },
  {
    className: "left-[2%] top-[66%] h-12 w-28 -rotate-12 border-[#f5c2c8]/25 bg-[#f5c2c8]/[0.02] sm:h-16 sm:w-40",
    x: 16,
    y: -12,
    rotate: 8,
    duration: 9.5,
  },
  {
    className: "right-[11%] top-[79%] size-14 rotate-45 border-[#e4dfda]/25 bg-[#e4dfda]/[0.018] sm:size-20",
    x: -8,
    y: 16,
    rotate: -10,
    duration: 8,
  },
  {
    className: "left-[6%] top-[91%] size-20 rotate-45 border-[#f5c2c8]/30 bg-[#f5c2c8]/[0.025] sm:size-28",
    x: 12,
    y: -18,
    rotate: 7,
    duration: 10,
  },
];

const kineticClusters = [
  { className: "right-[-4rem] top-[17%] sm:right-[2%]", size: "size-44 sm:size-64", duration: 24, reverse: false },
  { className: "left-[-5rem] top-[45%] sm:left-[2%]", size: "size-52 sm:size-72", duration: 31, reverse: true },
  { className: "right-[-4rem] top-[72%] sm:right-[4%]", size: "size-48 sm:size-64", duration: 27, reverse: false },
  { className: "left-[-3rem] top-[86%] sm:left-[7%]", size: "size-40 sm:size-56", duration: 22, reverse: true },
];

export function AmbientGeometry() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute left-[-10rem] top-[30%] size-[24rem] rounded-full bg-[#f5c2c8]/[0.035] blur-[110px]" />
      <div className="absolute right-[-12rem] top-[68%] size-[30rem] rounded-full bg-[#f5c2c8]/[0.04] blur-[130px]" />
      <div className="absolute left-[20%] top-[82%] size-[22rem] rounded-full bg-[#f5c2c8]/[0.025] blur-[120px]" />

      {floatingShapes.map((shape, index) => (
        <motion.div
          key={shape.className}
          className={`absolute border ${shape.className}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          animate={reduceMotion ? undefined : { x: [0, shape.x, 0], y: [0, shape.y, 0], rotate: [0, shape.rotate, 0] }}
          transition={{
            opacity: { duration: 0.8, delay: index * 0.04 },
            x: { duration: shape.duration, repeat: Infinity, ease: "easeInOut" },
            y: { duration: shape.duration, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: shape.duration, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      ))}

      {kineticClusters.map((cluster, index) => (
        <motion.div
          key={cluster.className}
          className={`absolute ${cluster.className} ${cluster.size}`}
          initial={{ opacity: 0, scale: 0.86 }}
          whileInView={{ opacity: 0.72, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.1, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="absolute inset-[14%] rotate-45 border border-[#f5c2c8]/25 bg-[#f5c2c8]/[0.025]"
            animate={reduceMotion ? undefined : { rotate: cluster.reverse ? [45, -315] : [45, 405] }}
            transition={{ duration: cluster.duration, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-[28%] border border-[#e4dfda]/20 bg-[#f5c2c8]/[0.018]"
            animate={reduceMotion ? undefined : { rotate: cluster.reverse ? 360 : -360, scale: [0.92, 1.08, 0.92] }}
            transition={{ duration: cluster.duration * 0.72, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-[5%] rounded-full border border-[#f5c2c8]/15"
            animate={reduceMotion ? undefined : { rotate: cluster.reverse ? -360 : 360 }}
            transition={{ duration: cluster.duration * 0.82, repeat: Infinity, ease: "linear" }}
          >
            <span className="absolute left-1/2 top-[-3px] size-1.5 -translate-x-1/2 rounded-full bg-[#f5c2c8]/80 shadow-[0_0_16px_rgba(245,194,200,0.55)]" />
            <span className="absolute bottom-[9%] left-[16%] size-1 rotate-45 bg-[#f5c2c8]/60" />
          </motion.div>
          <svg className="absolute inset-0 size-full overflow-visible" viewBox="0 0 100 100" fill="none">
            <motion.path
              d="M8 58 C24 18, 70 10, 92 42 C72 78, 33 92, 8 58Z"
              stroke="rgba(245,194,200,0.2)"
              strokeWidth="0.45"
              strokeDasharray="3 5"
              animate={reduceMotion ? undefined : { pathLength: [0.35, 1, 0.35], opacity: [0.25, 0.7, 0.25] }}
              transition={{ duration: cluster.duration * 0.38, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
          <motion.span
            className="absolute left-[47%] top-[47%] size-[6%] rotate-45 bg-[#f5c2c8]/35"
            animate={reduceMotion ? undefined : { scale: [0.7, 1.35, 0.7], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3.2 + index * 0.45, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      ))}

      <motion.div
        className="absolute right-[8%] top-[35%] size-36 rounded-full border border-[#f5c2c8]/20 sm:size-52"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute left-1/2 top-[-3px] size-1.5 -translate-x-1/2 rounded-full bg-[#f5c2c8]/70" />
        <span className="absolute bottom-[18%] right-[4%] size-1 rounded-full bg-[#e4dfda]/55" />
      </motion.div>

      <motion.div
        className="absolute left-[12%] top-[57%] h-px w-28 origin-left bg-gradient-to-r from-[#f5c2c8]/55 to-transparent sm:w-48"
        animate={reduceMotion ? undefined : { scaleX: [0.45, 1, 0.45], opacity: [0.35, 0.8, 0.35] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[6%] right-[5%] grid size-20 grid-cols-3 gap-3 opacity-35 sm:size-28"
        animate={reduceMotion ? undefined : { y: [0, -12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        {Array.from({ length: 9 }).map((_, index) => (
          <span key={index} className="m-auto size-1 rotate-45 bg-[#f5c2c8]" />
        ))}
      </motion.div>
    </div>
  );
}
