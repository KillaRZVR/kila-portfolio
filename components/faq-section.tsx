import { RevealSection } from "@/components/reveal-section";
import { Separator } from "@/components/ui/separator";
import { siteData } from "@/lib/data";

export function FAQSection() {
  return (
    <section id="faq" className="relative scroll-mt-12 py-10 sm:py-14">
      <Separator className="opacity-40" />
      <RevealSection className="relative pt-7">
        <span className="pointer-events-none absolute left-0 top-2 text-[clamp(4.5rem,9vw,7.5rem)] leading-none tracking-[-0.1em] text-foreground/[0.045]">{siteData.faq.sectionNumber}</span>
        <div className="relative grid gap-8 lg:grid-cols-12">
          <h2 className="display-tight text-[clamp(2.8rem,5vw,5.4rem)] font-normal lg:col-span-5">{siteData.faq.title}</h2>
          <div className="divide-y divide-[#3c3c38] border-y border-[#3c3c38] lg:col-span-7">
            {siteData.faq.items.map((item, index) => <details key={item.question} className="group py-1"><summary className="flex min-h-12 cursor-pointer list-none items-center gap-4 py-3 text-base leading-snug focus-visible:outline-none focus-visible:text-[#f5c2c8]"><span className="font-telemetry text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span><span>{item.question}</span><span className="ml-auto text-xl text-[#f5c2c8] transition-transform group-open:rotate-45">+</span></summary><p className="pb-4 pl-9 pr-8 text-sm leading-relaxed text-muted-foreground">{item.answer}</p></details>)}
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-5 border-t border-[#3c3c38] pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xl leading-snug tracking-[-0.04em] sm:text-2xl">Расскажите о задаче</p>
            <p className="mt-2 text-sm text-muted-foreground">{siteData.responseTime}</p>
          </div>
          <a href="#contacts" className="font-xanmono inline-flex min-h-12 shrink-0 items-center justify-center rounded-full border border-[#f5c2c8] px-6 text-sm uppercase text-[#f5c2c8] transition-colors hover:bg-[#f5c2c8] hover:text-[#12130f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c2c8]">
            Обсудить проект
          </a>
        </div>
      </RevealSection>
    </section>
  );
}
