import { AmbientGeometry } from "@/components/ambient-geometry";
import { FAQSection } from "@/components/faq-section";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HeroArtifact } from "@/components/hero-artifact";
import { HeroButtons } from "@/components/hero-buttons";
import { PriceSection } from "@/components/price-section";
import { ProjectsSection } from "@/components/projects-section";
import { RoadmapSection } from "@/components/roadmap-section";
import { siteData } from "@/lib/data";

export default function Home() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden">
      <AmbientGeometry />
      <Header />
      <div className="relative z-10 px-4 sm:px-6 lg:px-8">
        <section className="relative grid min-h-[clamp(20rem,50vh,32rem)] grid-cols-1 gap-4 pb-7 pt-2 lg:grid-cols-12 lg:gap-8">
          <div className="relative order-1 flex min-h-[17rem] items-center lg:col-span-7 lg:min-h-0">
            <div className="absolute -inset-8 -z-10 bg-[radial-gradient(ellipse_at_left,rgba(245,194,200,0.12),transparent_64%)]" />
            <div className="max-w-[48rem]">
              <h1 className="font-xanmono text-balance text-[clamp(2.15rem,3.3vw,3.35rem)] font-normal leading-[1.01] tracking-[-0.05em]">{siteData.heroNote}</h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">{siteData.heroSubline}</p>
            </div>
          </div>
          <div className="relative order-2 flex min-h-[18rem] items-center justify-center sm:min-h-[21rem] lg:col-span-5 lg:min-h-0">
            <div className="pointer-events-none absolute inset-4 flex items-center justify-center opacity-40 sm:inset-0"><HeroArtifact /></div>
            <div className="relative z-10 ml-auto flex w-full max-w-[21rem] flex-col gap-3">
              <a href="#contacts" data-cursor="cta" aria-label="Обсудить проект — перейти к контактам" className="group relative flex min-h-36 w-full flex-col justify-between border border-[#f5c2c8]/70 bg-[#f5c2c8]/[0.04] p-5 text-[#f5c2c8] transition-[transform,background-color,color,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-[#f5c2c8] hover:bg-[#f5c2c8] hover:text-[#12130f] hover:shadow-[0_0_40px_rgba(245,194,200,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c2c8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12130f] sm:min-h-44 sm:p-7">
                <span className="font-xanmono text-[clamp(1.35rem,2.1vw,1.75rem)] uppercase leading-[0.95] tracking-[-0.045em]">Обсудить<br />проект</span>
                <span className="absolute right-5 top-5 text-xl transition-transform duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[3px] sm:right-7 sm:top-7" aria-hidden="true">↗</span>
                <span className="max-w-[13rem] text-xs leading-relaxed text-current/70 sm:text-sm">{siteData.responseTime}</span>
              </a>
              <HeroButtons />
            </div>
          </div>
        </section>
        <ProjectsSection />
        <section aria-label="Обсудить похожий проект" className="flex flex-col gap-5 border-y border-[#3c3c38] py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-lg leading-snug tracking-[-0.035em] sm:text-xl">Есть похожая задача? За один разговор определим формат, сроки и следующий шаг.</p>
          <a href="#contacts" className="font-xanmono inline-flex min-h-12 shrink-0 items-center justify-center rounded-full border border-[#f5c2c8] px-6 text-sm uppercase text-[#f5c2c8] transition-[transform,box-shadow,border-color] hover:-translate-y-0.5 hover:border-[#ffd9df] hover:shadow-[0_0_22px_rgba(245,194,200,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c2c8]">{siteData.feedback}</a>
        </section>
        <RoadmapSection />
        <PriceSection />
        <FAQSection />
        <Footer />
      </div>
    </main>
  );
}
