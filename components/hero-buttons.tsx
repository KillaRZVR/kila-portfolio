"use client";

import { ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteData } from "@/lib/data";

export function HeroButtons() {
  const scrollTo = (target: string) => document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });

  return (
    <nav aria-label="Навигация по странице" className="grid w-full gap-0">
      {siteData.navigation.map((item) => (
        <Button
          key={item.target}
          variant="ghost"
          onClick={() => scrollTo(item.target)}
          className="font-telemetry group h-12 w-full justify-between rounded-none border-b border-[#3c3c38] px-0 text-xs uppercase text-foreground hover:bg-transparent hover:text-[#f5c2c8]"
        >
          {item.label}
          <ArrowDownRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
        </Button>
      ))}
    </nav>
  );
}
