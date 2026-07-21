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
    <section id="prices" className="relative scroll-mt-12 py-14 sm:py-20">
      <Separator className="opacity-40" />
      <RevealSection className="relative pt-7">
        <span className="pointer-events-none absolute left-0 top-2 text-[clamp(5rem,11vw,9rem)] leading-none tracking-[-0.1em] text-foreground/[0.045]">{siteData.prices.sectionNumber}</span>
        <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="font-telemetry mb-4 text-[11px] uppercase text-[#f5c2c8]">{siteData.prices.label}</p>
            <h2 className="display-tight text-[clamp(3.4rem,8.5vw,8rem)] font-normal">{siteData.prices.title}</h2>
            <p className="mt-8 max-w-3xl text-[clamp(1.5rem,3vw,3rem)] leading-[1.02] tracking-[-0.04em] text-[#f5c2c8]">{siteData.prices.text}</p>
            <p className="mt-5 max-w-xl text-base leading-snug text-muted-foreground">{siteData.prices.note}</p>
          </div>
          <div id="contacts" className="flex scroll-mt-12 flex-col items-start gap-2 lg:col-span-4">
            {contacts.map(({ label, value, href, icon: Icon }) => (
              <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="group flex min-h-12 w-full items-center gap-3 rounded-full border border-transparent px-1 pr-4 transition-[border-color,box-shadow] hover:border-[#f5c2c8] hover:bg-transparent hover:text-foreground hover:shadow-[0_0_18px_rgba(245,194,200,0.2)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#f5c2c8]">
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-[#3c3c38] transition-colors group-hover:border-[#f5c2c8]"><Icon className="size-4" /></span>
                <span className="font-telemetry text-[10px] uppercase text-muted-foreground">{label}</span>
                <span className="ml-auto text-base tracking-[-0.03em] sm:text-lg">{value}</span>
              </a>
            ))}
          </div>
        </div>
      </RevealSection>
    </section>
  );
}
