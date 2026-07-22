"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";

export function RevealSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-12% 0px" });
  const reduceMotion = useReducedMotion();
  const hidden = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 };
  const visible = { opacity: 1, y: 0 };
  return <motion.div ref={ref} initial={hidden} animate={isInView || reduceMotion ? visible : hidden} transition={{ duration: reduceMotion ? 0 : 0.58, ease: [0.22, 1, 0.36, 1] }} className={className}>{children}</motion.div>;
}
