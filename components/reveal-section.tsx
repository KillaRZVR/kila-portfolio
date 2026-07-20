"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

export function RevealSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-12% 0px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }} className={className}>{children}</motion.div>
  );
}
