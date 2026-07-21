"use client";
import { useState } from "react";
import { RevealSection } from "@/components/reveal-section";
import { Separator } from "@/components/ui/separator";
import { siteData } from "@/lib/data";
const days = Array.from({ length: 14 }, (_, index) => index + 1);
export function RoadmapSection() {
  const [activeId, setActiveId] = useState(siteData.roadmap.items[0].id);
  const activeItem =
    siteData.roadmap.items.find((item) => item.id === activeId) ??
    siteData.roadmap.items[0];
  const activeIndex = siteData.roadmap.items.findIndex(
    (item) => item.id === activeId,
  );
  return (
    <section id="roadmap" className="relative scroll-mt-12 py-10 sm:py-14">
      <Separator className="opacity-40" />
      <RevealSection className="relative pt-7">
        <span className="pointer-events-none absolute left-0 top-3 text-[clamp(5rem,11vw,9rem)] leading-none tracking-[-0.1em] text-foreground/[0.045]">
          {siteData.roadmap.sectionNumber}
        </span>
        <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <p className="font-telemetry mb-4 text-xs uppercase text-[#f5c2c8]">{siteData.roadmap.label}</p>
            <h2 className="display-tight text-[clamp(3.2rem,6vw,6.4rem)] font-normal">{siteData.roadmap.title}</h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">{siteData.roadmap.text}</p>
          </div>
          <div className="min-w-0 lg:col-span-8 lg:pt-8">
            <p className="font-telemetry mb-3 text-xs uppercase text-muted-foreground">Нажмите на этап, чтобы увидеть результат</p>
            <div className="overflow-x-auto pb-3"><div className="min-w-[760px]">
              <div className="grid border-b border-r border-[#3c3c38]" style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }}>
                {days.map((day) => <div key={day} className="font-telemetry flex h-9 items-center justify-center border-l border-[#3c3c38]/60 text-xs text-muted-foreground">{String(day).padStart(2, "0")}</div>)}
              </div>
              <div className="relative grid gap-y-2 py-3" style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))", gridTemplateRows: `repeat(${siteData.roadmap.items.length}, minmax(3rem, auto))` }}>
                <div className="pointer-events-none absolute inset-0 grid border-r border-[#3c3c38]/35" style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }}>
                  {days.map((day) => <span key={day} className="border-l border-[#3c3c38]/35" />)}
                </div>
                {siteData.roadmap.items.map((item, index) => {
                  const isActive = item.id === activeId;
                  return <button key={item.id} type="button" aria-pressed={isActive} aria-controls="roadmap-description" onClick={() => setActiveId(item.id)} style={{ gridColumn: `${item.start} / ${item.end + 1}`, gridRow: index + 1 }} className={`relative z-10 flex min-h-12 items-center overflow-hidden border px-1 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#f5c2c8] sm:px-2 ${isActive ? "border-[#f5c2c8] bg-[#f5c2c8] text-[#12130f]" : "border-[#3c3c38] bg-[#1b1c18] text-[#e4dfda] hover:border-[#f5c2c8]"}`}><span className="block min-w-0 whitespace-nowrap text-[0.55rem] uppercase leading-tight tracking-[-0.04em] sm:text-[0.64rem] xl:text-xs">{item.shortTitle ?? item.title}</span></button>;
                })}
              </div>
            </div></div>
          </div>
          <div id="roadmap-description" aria-live="polite" className="grid gap-4 border-l-2 border-[#f5c2c8] bg-[#1b1c18]/55 px-4 py-4 lg:col-span-12 sm:grid-cols-[1fr_auto]">
            <div><p className="font-telemetry text-xs uppercase text-[#f5c2c8]">Этап {String(activeIndex + 1).padStart(2, "0")} · {activeItem.duration}</p><p className="mt-2 text-xl tracking-[-0.04em]">{activeItem.title}</p><p className="mt-2 max-w-3xl text-base leading-relaxed text-muted-foreground">{activeItem.description}</p></div>
            <div className="border-t border-[#3c3c38] pt-3 sm:max-w-64 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0"><p className="font-telemetry text-xs uppercase text-muted-foreground">Результат этапа</p><p className="mt-2 text-sm leading-relaxed text-[#e4dfda]">{activeItem.result}</p></div>
          </div>
        </div>
      </RevealSection>
    </section>
  );
}
