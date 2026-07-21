"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { RevealSection } from "@/components/reveal-section";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { siteData } from "@/lib/data";

export function ProjectsSection() {
  const [openId, setOpenId] = useState<number | null>(null);
  return (
    <section id="projects" className="relative scroll-mt-12 py-10 sm:py-12">
      <Separator className="opacity-40" />
      <RevealSection className="relative pt-6">
        <span className="pointer-events-none absolute left-0 top-4 text-[clamp(5rem,11vw,9rem)] leading-none tracking-[-0.1em] text-foreground/[0.045]">{siteData.projects.sectionNumber}</span>
        <div className="relative z-10 mx-auto mb-8 flex max-w-none flex-col items-center gap-4 text-center sm:mb-10">
          <h2 className="font-xanmono text-balance text-[clamp(3rem,7vw,6.8rem)] font-normal leading-none tracking-[-0.06em]">{siteData.projects.title}</h2>
          <p className="font-xanmono m-0 text-[11px] uppercase leading-none text-muted-foreground">{siteData.projects.hint}</p>
        </div>
        <div className="grid gap-2 md:grid-cols-3">
          {siteData.projects.items.map((project, index) => {
            const isOpen = openId === project.id;
            return (
              <motion.div key={project.id} layout>
                <Card role="button" tabIndex={0} aria-expanded={isOpen} onClick={() => setOpenId(isOpen ? null : project.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setOpenId(isOpen ? null : project.id); } }} className="group cursor-pointer overflow-hidden rounded-none border-0 bg-transparent shadow-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#f5c2c8]">
                  <div className="aspect-[4/3] bg-[#1b1c18] p-3 transition-colors duration-500 group-hover:bg-[#20211d]">
                    <span className="font-xanmono text-[10px] text-muted-foreground">0{index + 1} / 03</span>
                    <div className="flex h-full items-center justify-center"><div className="size-16 rotate-45 border border-[#e4dfda]/25 transition-transform duration-500 group-hover:rotate-[55deg] group-hover:border-[#f5c2c8]/70" /></div>
                  </div>
                  <CardHeader className="flex-row items-start justify-between space-y-0 px-0 py-4">
                    <div className="pr-4">
                      <h3 className="font-xanmono text-[clamp(1.6rem,2.5vw,2.4rem)] font-normal tracking-[-0.04em]">{project.title}</h3>
                      <p className="font-xanmono mt-1 text-[10px] uppercase text-[#f5c2c8]">{project.category}</p>
                      <p className="mt-3 max-w-sm text-sm leading-snug text-muted-foreground">{project.summary}</p>
                    </div>
                    <span className="grid size-10 shrink-0 place-items-center rounded-full border border-[#3c3c38]">{isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}</span>
                  </CardHeader>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ height: { duration: 0.3 }, opacity: { duration: 0.2 } }} className="overflow-hidden">
                        <CardContent className="border-t border-[#3c3c38] px-0 py-4 text-sm leading-tight text-[#e4dfda]">
                          {project.details}
                          <div className="mt-4">
                            <h4 className="font-xanmono text-[clamp(1.2rem,2vw,1.8rem)] font-normal tracking-[-0.04em]">Roadmap</h4>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col">
                                <p className="font-xanmono text-[10px] uppercase text-muted-foreground">Принятие задач</p>
                                <p className="font-xanmono text-[10px] uppercase text-muted-foreground">Согласование</p>
                                <p className="font-xanmono text-[10px] uppercase text-muted-foreground">Разработка</p>
                                <p className="font-xanmono text-[10px] uppercase text-muted-foreground">Согласование</p>
                                <p className="font-xanmono text-[10px] uppercase text-muted-foreground">Референс</p>
                              </div>
                              <div className="flex flex-col">
                                <p className="font-xanmono text-[10px] uppercase text-muted-foreground">День 1</p>
                                <p className="font-xanmono text-[10px] uppercase text-muted-foreground">День 3</p>
                                <p className="font-xanmono text-[10px] uppercase text-muted-foreground">День 7</p>
                                <p className="font-xanmono text-[10px] uppercase text-muted-foreground">День 10</p>
                                <p className="font-xanmono text-[10px] uppercase text-muted-foreground">День 14</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </RevealSection>
    </section>
  );
}
