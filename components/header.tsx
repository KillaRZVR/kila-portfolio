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
      <div className="flex items-start justify-between gap-6">
        <a href="#top" className="block w-[55vw] max-w-[28rem] sm:w-[34vw] lg:w-[25vw]" aria-label="На главную">
          <span className="flex overflow-hidden text-[clamp(4.3rem,10vw,9.5rem)] font-normal leading-[0.72] tracking-[-0.11em]">
            {siteData.brand.split("").map((letter, index) => (
              <motion.span key={`${letter}-${index}`} initial={{ y: "115%", rotate: index % 2 ? 4 : -3 }} animate={{ y: 0, rotate: index === 2 ? -5 : index % 2 ? 1 : -1 }} transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }} className={index === 2 ? "rose-glow" : ""}>{letter}</motion.span>
            ))}
          </span>
          <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.5 }} className="font-telemetry mt-3 block max-w-56 text-[11px] uppercase leading-tight text-muted-foreground sm:text-xs">{siteData.eyebrow}</motion.span>
        </a>
        <Button variant="ghost" onClick={scrollToContacts} className="font-telemetry h-11 rounded-full px-4 text-xs uppercase text-foreground hover:bg-foreground hover:text-background sm:px-6">{siteData.feedback}</Button>
      </div>
    </header>
  );
}
