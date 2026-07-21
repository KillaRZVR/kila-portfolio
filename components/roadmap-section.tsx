"use client";

import { useState } from "react";
import { RevealSection } from "@/components/reveal-section";
import { Separator } from "@/components/ui/separator";
import { siteData } from "@/lib/data";

export function RoadmapSection() {
  const [activeId, setActiveId] = useState(siteData.roadmap.items[0].id);
  const activeItem = siteData.roadmap.items.find((item) => item.id === activeId) ?? siteData.roadmap.items[0];

  return (
    <section id="roadmap" className="relative scroll-mt-12 py-10 sm:py-14">
      <Separator className="opacity-40" />
      <RevealSection className="relative pt-7">
        <span className="pointer-events-none absolute left-0 top-3 text-[clamp(5rem,11vw,9rem)] leading-none tracking-[-0.1em] text-foreground/[0.045]">{siteData.roadmap.sectionNumber}</span>
        <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <p className="font-telemetry mb-4 text-[11px] uppercase text-[#f5c2c8]">{siteData.roadmap.label}</p>
            <h2 className="display-tight text-[clamp(3.2rem,6vw,6.4rem)] font-normal">{siteData.roadmap.title}</h2>
            <p className="mt-6 max-w-md text-base leading-snug text-muted-foreground sm:text-lg">{siteData.roadmap.text}</p>
          </div>

          <div className="min-w-0 lg:col-span-8 lg:pt-8">
            <div className="font-telemetry mb-4 flex items-center justify-between text-[10px] uppercase text-muted-foreground">
              <span>День 1</span>
              <span className="tracking-[0.45em] text-[#f5c2c8]">•••</span>
              <span>День {siteData.roadmap.items.length}</span>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {siteData.roadmap.items.map((item, index) => {
                const isActive = item.id === activeId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={isActive}
                    aria-controls="roadmap-description"
                    onClick={() => setActiveId(item.id)}
                    className={`group relative min-h-28 border p-3 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#f5c2c8] ${
                      isActive
                        ? "border-[#f5c2c8] bg-[#f5c2c8] text-[#12130f]"
                        : "border-[#3c3c38] bg-[#1b1c18]/70 text-[#e4dfda] hover:border-[#f5c2c8]"
                    }`}
                  >
                    <span className={`font-telemetry inline-flex border px-2 py-1 text-[9px] uppercase ${isActive ? "border-[#12130f]/35" : "border-[#3c3c38] text-[#f5c2c8] group-hover:border-[#f5c2c8]/70"}`}>
                      День {index + 1}
                    </span>
                    <span className="mt-5 block pr-6 text-[11px] uppercase leading-tight tracking-[-0.03em]">{item.title}</span>
                    <span className="font-telemetry absolute bottom-3 right-3 text-[9px] opacity-55">{String(index + 1).padStart(2, "0")}</span>
                  </button>
                );
              })}
            </div>

            <div id="roadmap-description" aria-live="polite" className="mt-3 border-l-2 border-[#f5c2c8] bg-[#1b1c18]/55 px-4 py-4">
              <p className="font-telemetry text-[10px] uppercase text-[#f5c2c8]">День {siteData.roadmap.items.findIndex((item) => item.id === activeId) + 1}</p>
              <p className="mt-2 text-xl tracking-[-0.04em]">{activeItem.title}</p>
              <p className="mt-2 max-w-3xl text-sm leading-snug text-muted-foreground">{activeItem.description}</p>
            </div>
          </div>
        </div>
      </RevealSection>
    </section>
  );
}
