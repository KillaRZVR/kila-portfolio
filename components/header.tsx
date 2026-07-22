"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { siteData } from "@/lib/data";

function scrollToContacts() {
  document.getElementById("contacts")?.scrollIntoView({ behavior: "smooth" });
}

export function Header() {
  return (
    <header id="top" className="relative z-40 px-4 pt-4 sm:px-6 sm:pt-5 lg:px-8">
      <div className="flex items-start justify-between gap-3 sm:gap-6">
        <a href="#top" className="font-xanmono relative block w-[58vw] pb-5 sm:w-[38vw] sm:pb-6 lg:w-[28vw] lg:max-w-[32rem]" aria-label="На главную">
          <span className="flex pb-2 text-[clamp(4.5rem,8.6vw,8.5rem)] font-normal leading-[0.84] tracking-[-0.09em]">
            {siteData.brand.split("").map((letter, index) => (
              <motion.span key={`${letter}-${index}`} initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.65, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }} className={index === 2 || index === 3 ? "rose-glow" : ""}>{letter}</motion.span>
            ))}
          </span>
          <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45, duration: 0.45 }} className="font-xanmono absolute left-full top-1/2 ml-4 hidden w-64 -translate-y-1/2 text-xs uppercase leading-tight text-muted-foreground md:block lg:ml-6">{siteData.eyebrow}</motion.span>
        </a>
        <Button variant="ghost" onClick={scrollToContacts} className="font-xanmono h-12 min-w-[8rem] justify-center rounded-full border border-[#3c3c38] px-3 text-[10px] uppercase text-foreground transition-[border-color,box-shadow] hover:border-[#f5c2c8] hover:bg-transparent hover:text-foreground hover:shadow-[0_0_18px_rgba(245,194,200,0.2)] sm:h-14 sm:min-w-[13rem] sm:px-8 sm:text-sm">{siteData.feedback}</Button>
      </div>
    </header>
  );
}
