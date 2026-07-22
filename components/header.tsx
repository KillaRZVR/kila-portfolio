"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { siteData } from "@/lib/data";

function scrollToContacts() { document.getElementById("contacts")?.scrollIntoView({ behavior: "smooth" }); }

export function Header() {
  const reduceMotion = useReducedMotion();
  return (
    <header id="top" className="relative z-40 px-4 pt-4 sm:px-6 sm:pt-5 lg:px-8">
      <div className="flex items-start justify-between gap-3 sm:gap-6">
        <a href="#top" className="font-xanmono block w-[58vw] sm:w-[38vw] md:relative md:pb-6 lg:w-[28vw] lg:max-w-[32rem]" aria-label="На главную">
          <span className="flex pb-2 text-[clamp(4.5rem,8.6vw,8.5rem)] font-normal leading-[0.84] tracking-[-0.09em]">
            {siteData.brand.split("").map((letter, index) => (
              <motion.span key={`${letter}-${index}`} initial={reduceMotion ? false : { y: "105%" }} animate={{ y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.65, delay: reduceMotion ? 0 : index * 0.07, ease: [0.22, 1, 0.36, 1] }} className={index === 2 || index === 3 ? "rose-glow" : ""}>{letter}</motion.span>
            ))}
          </span>
          <motion.span initial={reduceMotion ? false : { opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: reduceMotion ? 0 : 0.45, duration: reduceMotion ? 0 : 0.45 }} className="font-xanmono mt-1 block max-w-64 text-[10px] uppercase leading-tight text-muted-foreground md:absolute md:left-full md:top-1/2 md:ml-4 md:mt-0 md:w-64 md:-translate-y-1/2 md:text-xs lg:ml-6">{siteData.eyebrow}</motion.span>
        </a>
        <Button variant="ghost" onClick={scrollToContacts} className="font-xanmono h-12 min-w-[8rem] justify-center rounded-full border border-[#3c3c38] px-3 text-[10px] uppercase text-foreground transition-[border-color,box-shadow] hover:border-[#f5c2c8] hover:bg-transparent hover:text-foreground hover:shadow-[0_0_18px_rgba(245,194,200,0.2)] sm:h-14 sm:min-w-[13rem] sm:px-8 sm:text-sm">{siteData.feedback}</Button>
      </div>
    </header>
  );
}
