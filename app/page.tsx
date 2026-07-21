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
        <section className="relative grid min-h-[clamp(20rem,52vh,34rem)] grid-cols-1 gap-4 pb-8 pt-2 lg:grid-cols-12 lg:gap-8">
          <div className="relative order-1 flex min-h-[18rem] items-center lg:col-span-6 lg:min-h-0">
            <div className="absolute -inset-8 -z-10 bg-[radial-gradient(ellipse_at_left,rgba(245,194,200,0.12),transparent_64%)]" />
            <div className="max-w-[46rem]">
              <h1 className="font-xanmono text-balance text-[clamp(2.25rem,3.65vw,3.7rem)] font-normal leading-[0.98] tracking-[-0.05em]">{siteData.heroNote}</h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{siteData.heroSubline}</p>
            </div>
          </div>
          <div className="relative order-2 flex min-h-[14rem] items-center justify-center sm:min-h-[18rem] lg:col-span-6 lg:min-h-0">
            <div className="pointer-events-none absolute inset-4 flex items-center justify-center opacity-65 sm:inset-0"><HeroArtifact /></div>
            <div className="relative z-10 ml-auto w-full max-w-[20rem]"><HeroButtons /></div>
          </div>
        </section>
        <ProjectsSection />
        <section aria-label="Обсудить похожий проект" className="flex flex-col gap-5 border-y border-[#3c3c38] py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-xl leading-snug tracking-[-0.035em] sm:text-2xl">Есть похожая задача? За один разговор определим формат, сроки и следующий шаг.</p>
          <a href="#contacts" className="font-xanmono inline-flex min-h-12 shrink-0 items-center justify-center rounded-full border border-[#f5c2c8] px-6 text-sm uppercase text-[#f5c2c8] transition-colors hover:bg-[#f5c2c8] hover:text-[#12130f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c2c8]">{siteData.feedback}</a>
        </section>
        <RoadmapSection />
        <PriceSection />
        <FAQSection />
        <Footer />
      </div>
    </main>
  );
}
