"use client";

import { motion, useReducedMotion } from "framer-motion";

const shapes = [
  {
    top: 15,
    left: 4,
    size: 88,
    kind: "diamond",
    drift: 14,
    duration: 8.5,
    delay: 0.2,
  },
  {
    top: 27,
    left: 88,
    size: 132,
    kind: "orbit",
    drift: -18,
    duration: 10.2,
    delay: 0.9,
  },
  {
    top: 38,
    left: 7,
    size: 64,
    kind: "square",
    drift: -12,
    duration: 7.8,
    delay: 0.4,
  },
  {
    top: 49,
    left: 82,
    size: 92,
    kind: "diamond",
    drift: 16,
    duration: 9.4,
    delay: 1.3,
  },
  {
    top: 61,
    left: 2,
    size: 118,
    kind: "orbit",
    drift: 13,
    duration: 11.2,
    delay: 0.7,
  },
  {
    top: 72,
    left: 91,
    size: 58,
    kind: "square",
    drift: -10,
    duration: 7.2,
    delay: 0.1,
  },
  {
    top: 83,
    left: 8,
    size: 76,
    kind: "diamond",
    drift: -15,
    duration: 8.9,
    delay: 1.1,
  },
  {
    top: 93,
    left: 84,
    size: 110,
    kind: "orbit",
    drift: 12,
    duration: 10.6,
    delay: 0.5,
  },
] as const;

function Shape({ kind }: { kind: (typeof shapes)[number]["kind"] }) {
  if (kind === "orbit") {
    return (
      <div className="relative size-full rounded-full border border-[#f5c2c8]/25">
        <div className="absolute inset-[26%] rotate-45 border border-[#e4dfda]/20 bg-[#f5c2c8]/[0.035]" />
        <div className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f5c2c8]/65" />
      </div>
    );
  }

  return (
    <div
      className={`size-full border bg-[#e4dfda]/[0.015] ${
        kind === "diamond"
          ? "rotate-45 border-[#f5c2c8]/30"
          : "border-[#e4dfda]/20"
      }`}
    />
  );
}

export function SiteGeometry() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {shapes.map((shape, index) => (
        <motion.div
          key={`${shape.top}-${shape.left}`}
          className={`absolute ${index === 1 || index === 6 ? "hidden sm:block" : "block"}`}
          style={{
            top: `${shape.top}%`,
            left: `clamp(12px, ${shape.left}%, calc(100% - ${shape.size + 12}px))`,
            width: shape.size,
            height: shape.size,
          }}
          initial={{ opacity: 0, scale: 0.82 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "120px" }}
          animate={
            reduceMotion
              ? undefined
              : {
                  y: [0, shape.drift, 0],
                  rotate: [0, index % 2 === 0 ? 6 : -6, 0],
                  scale: [1, 1.04, 1],
                }
          }
          transition={{
            opacity: { duration: 0.8, delay: shape.delay },
            scale: {
              duration: reduceMotion ? 0.8 : shape.duration,
              repeat: reduceMotion ? 0 : Infinity,
              ease: "easeInOut",
            },
            y: {
              duration: shape.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: shape.delay,
            },
            rotate: {
              duration: shape.duration + 1.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: shape.delay,
            },
          }}
        >
          <Shape kind={shape.kind} />
        </motion.div>
      ))}
    </div>
  );
}
