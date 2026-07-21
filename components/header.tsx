"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { siteData } from "@/lib/data";
function scrollToContacts() { document.getElementById("contacts")?.scrollIntoView({ behavior: "smooth" }); }
export function Header() {
  return (
    <header id="top" className="relative z-40 px-4 pt-4 sm:px-6 sm:pt-5 lg:px-8">
      <div className="flex items-start justify-between gap-3 sm:gap-6">
        <a href="#top" className="font-xanmono block w-[58vw] sm:w-[38vw] lg:w-[28vw] lg:max-w-[32rem]" aria-label="На главную">
          <span className="flex pb-2 text-[clamp(4.5rem,8.6vw,8.5rem)] font-normal leading-[0.84] tracking-[-0.09em]">
            {siteData.brand.split("").map((letter, index) => (
              <motion.span key={`${letter}-${index}`} initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.65, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }} className={index === 2 || index === 3 ? "rose-glow" : ""}>{letter}</motion.span>
            ))}
          </span>
          <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.45 }} className="font-xanmono mt-1 block max-w-64 text-[10px] uppercase leading-tight text-muted-foreground sm:text-xs">{siteData.eyebrow}</motion.span>
        </a>
        <Button variant="ghost" onClick={scrollToContacts} className="font-xanmono h-12 min-w-[8rem] justify-center rounded-full border border-[#3c3c38] px-3 text-[10px] uppercase text-foreground hover:bg-foreground hover:text-background sm:h-14 sm:min-w-[13rem] sm:px-8 sm:text-sm">{siteData.feedback}</Button>
      </div>
    </header>
  );
}
