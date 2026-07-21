"use client";

import { useState } from "react";
import { RevealSection } from "@/components/reveal-section";
import { Separator } from "@/components/ui/separator";
import { siteData } from "@/lib/data";

export function RoadmapSection() {
  const [activeId, setActiveId] = useState(siteData.roadmap.items[0].id);
  return (
    <section id="roadmap" className="relative scroll-mt-12 py-9 sm:py-11">
      <Separator className="opacity-40" />
      <RevealSection className="relative pt-7">
        <span className="pointer-events-none absolute left-0 top-3 text-[clamp(4.5rem,9vw,7.5rem)] leading-none tracking-[-0.1em] text-foreground/[0.045]">
          {siteData.roadmap.sectionNumber}
        </span>
        <div className="relative grid gap-8 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <p className="font-telemetry mb-3 text-xs uppercase text-[#f5c2c8]">{siteData.roadmap.label}</p>
            <h2 className="display-tight text-[clamp(2.8rem,5vw,5.4rem)] font-normal">{siteData.roadmap.title}</h2>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-muted-foreground">{siteData.roadmap.text}</p>
          </div>
          <div className="min-w-0 lg:col-span-8 lg:pt-6">
            <div className="font-telemetry flex items-center justify-between border-b border-[#3c3c38] pb-3 text-xs uppercase text-muted-foreground"><span>Roadmap</span><span>01—04</span></div>
            <div className="border-b border-[#3c3c38]">
              {siteData.roadmap.items.map((item, index) => {
                const isActive = item.id === activeId;
                return (
                  <div key={item.id} className="border-t border-[#3c3c38] first:border-t-0">
                    <button type="button" aria-expanded={isActive} aria-controls={`roadmap-stage-${item.id}`} onClick={() => setActiveId(isActive ? 0 : item.id)} className={`grid min-h-16 w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 border-l-2 px-3 py-3 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:bg-[#f5c2c8]/[0.06] sm:grid-cols-[auto_minmax(0,1fr)_auto_auto] sm:gap-6 sm:px-4 ${isActive ? "border-l-[#f5c2c8]" : "border-l-transparent hover:bg-[#e4dfda]/[0.025]"}`}>
                      <span className="font-telemetry text-sm text-[#f5c2c8]">{String(index + 1).padStart(2, "0")}</span>
                      <span className="min-w-0"><span className="block text-base leading-tight tracking-[-0.035em] sm:text-lg">{item.title}</span><span className="mt-1 block text-sm leading-snug text-muted-foreground">{item.summary}</span><span className="font-telemetry mt-2 block text-sm text-muted-foreground sm:hidden">{item.duration}</span></span>
                      <span className="font-telemetry hidden text-sm text-muted-foreground sm:block">{item.duration}</span>
                      <span className="text-lg text-[#f5c2c8]" aria-hidden="true">{isActive ? "↗" : "↘"}</span>
                    </button>
                    {isActive && <div id={`roadmap-stage-${item.id}`} className="border-l-2 border-l-[#f5c2c8] bg-[#f5c2c8]/[0.06] px-5 pb-5 pt-1 sm:px-16"><div className="mb-3 flex flex-wrap gap-x-5 gap-y-2">{item.steps.map((step) => <span key={step} className="font-telemetry text-xs uppercase text-[#f5c2c8]">{step}</span>)}</div><p className="max-w-3xl text-sm leading-relaxed text-[#e4dfda]">{item.description}</p><p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground"><span className="text-[#f5c2c8]">Результат:</span>{" "}{item.result}</p></div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </RevealSection>
    </section>
  );
}
