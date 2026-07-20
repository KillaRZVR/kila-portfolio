"use client";

import { ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteData } from "@/lib/data";

export function HeroButtons() {
  const scrollTo = (target: string) => document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
  return (
    <nav aria-label="Навигация по странице" className="flex flex-wrap gap-1.5 lg:flex-col lg:items-end">
      {siteData.navigation.map((item) => (
        <Button key={item.target} variant="ghost" onClick={() => scrollTo(item.target)} className="font-telemetry group h-10 rounded-full px-4 text-[11px] uppercase text-foreground hover:bg-foreground hover:text-background">
          {item.label}<ArrowDownRight className="ml-3 size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
        </Button>
      ))}
    </nav>
  );
}
