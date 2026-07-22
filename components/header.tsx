"use client";

import { motion, useReducedMotion } from "framer-motion";
import { siteData } from "@/lib/data";

export function Header() {
  const reduceMotion = useReducedMotion();

  return (
    <header id="top" className="relative z-40 px-4 pt-4 sm:px-6 sm:pt-5 lg:px-8">
      <a href="#top" className="font-xanmono inline-flex max-w-full flex-col pb-6 md:flex-row md:items-center" aria-label="На главную">
        <span className="flex pb-2 text-[clamp(4rem,7.6vw,7.4rem)] font-normal leading-[0.84] tracking-[-0.09em]">
          {siteData.brand.split("").map((letter, index) => (
            <motion.span key={`${letter}-${index}`} initial={reduceMotion ? false : { y: "105%" }} animate={{ y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.65, delay: reduceMotion ? 0 : index * 0.07, ease: [0.22, 1, 0.36, 1] }} className={index === 2 || index === 3 ? "rose-glow" : ""}>{letter}</motion.span>
          ))}
        </span>
        <motion.span initial={reduceMotion ? false : { opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: reduceMotion ? 0 : 0.45, duration: reduceMotion ? 0 : 0.45 }} className="font-xanmono mt-1 block max-w-64 text-[10px] uppercase leading-tight text-muted-foreground md:mb-2 md:ml-5 md:mt-0 md:w-56 md:shrink-0 md:text-xs">{siteData.eyebrow}</motion.span>
      </a>
    </header>
  );
}
