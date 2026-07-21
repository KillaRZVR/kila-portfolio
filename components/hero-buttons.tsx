"use client";
import { ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteData } from "@/lib/data";
export function HeroButtons() {
  const scrollTo = (target: string) => {
    const section = document.getElementById(target);
    if (!section) return;

    const roadmapOffset = target === "roadmap" ? 120 : 0;
    const top = section.getBoundingClientRect().top + window.scrollY + roadmapOffset;
    window.scrollTo({ top, behavior: "smooth" });
  };
  return (
    <nav aria-label="Навигация по странице" className="grid w-full border-t border-[#3c3c38] bg-[#12130f]/35 px-3 backdrop-blur-sm">
      {siteData.navigation.map((item) => (
        <Button key={item.target} variant="ghost" onClick={() => scrollTo(item.target)} className="font-xanmono group h-12 w-full justify-between rounded-none border-b border-[#3c3c38] px-0 text-xs uppercase text-foreground hover:bg-transparent hover:text-[#f5c2c8]">
          {item.label}<ArrowDownRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
        </Button>
      ))}
    </nav>
  );
}
