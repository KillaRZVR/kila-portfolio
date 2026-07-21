import { Mail, Send } from "lucide-react";
import { RevealSection } from "@/components/reveal-section";
import { Separator } from "@/components/ui/separator";
import { siteData } from "@/lib/data";

export function PriceSection() {
  const contacts = [
    { label: siteData.contacts.emailLabel, value: siteData.contacts.email, href: `mailto:${siteData.contacts.email}`, icon: Mail },
    { label: siteData.contacts.telegramLabel, value: siteData.contacts.telegram, href: siteData.contacts.telegramUrl, icon: Send },
  ];
  return (
    <section id="prices" className="relative scroll-mt-12 py-10 sm:py-14">
      <Separator className="opacity-40" />
      <RevealSection className="relative pt-7">
        <span className="pointer-events-none absolute left-0 top-2 text-[clamp(4.5rem,9vw,7.5rem)] leading-none tracking-[-0.1em] text-foreground/[0.045]">{siteData.prices.sectionNumber}</span>
        <div className="relative">
          <p className="font-telemetry mb-3 text-xs uppercase text-[#f5c2c8]">{siteData.prices.label}</p>
          <h2 className="display-tight max-w-4xl text-[clamp(2.8rem,5.8vw,5.8rem)] font-normal">{siteData.prices.title}</h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">{siteData.prices.text}</p>
          <div className="mt-8 grid gap-px bg-[#3c3c38] md:grid-cols-3">
            {siteData.prices.items.map((item) => <article key={item.title} className="bg-[#12130f] p-5"><p className="font-telemetry text-xs uppercase text-muted-foreground">{item.duration}</p><h3 className="mt-4 text-xl tracking-[-0.04em] sm:text-2xl">{item.title}</h3><p className="mt-2 text-lg text-[#f5c2c8] sm:text-xl">{item.price}</p><p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.description}</p></article>)}
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">{siteData.prices.note}</p>
          <div className="mt-7 flex flex-col items-start gap-3">
            <a href="#contacts" className="font-xanmono inline-flex min-h-12 items-center justify-center rounded-full border border-[#f5c2c8] bg-[#f5c2c8] px-6 text-sm uppercase text-[#12130f] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_0_22px_rgba(245,194,200,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c2c8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12130f]">Получить оценку проекта</a>
            <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm">Итоговая стоимость фиксируется до начала работ и не меняется без согласования новых задач.</p>
          </div>
          <div id="contacts" className="mt-8 grid scroll-mt-12 gap-7 border-t border-[#3c3c38] pt-7 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5"><p className="text-xl leading-snug tracking-[-0.04em] sm:text-2xl">Готовы обсудить задачу?</p><p className="mt-2 text-sm text-muted-foreground">{siteData.responseTime}</p></div>
            <div className="flex flex-col gap-2 lg:col-span-7">{contacts.map(({ label, value, href, icon: Icon }) => <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="group flex min-h-14 w-full items-center gap-3 rounded-full border border-[#3c3c38] px-2 pr-5 transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-[#f5c2c8] hover:shadow-[0_0_18px_rgba(245,194,200,0.2)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#f5c2c8]"><span className="grid size-10 shrink-0 place-items-center rounded-full border border-[#3c3c38] transition-colors group-hover:border-[#f5c2c8]"><Icon className="size-4" /></span><span className="font-telemetry text-xs uppercase text-muted-foreground">{label}</span><span className="ml-auto text-base tracking-[-0.03em]">{value}</span></a>)}</div>
          </div>
        </div>
      </RevealSection>
    </section>
  );
}
