import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HeroArtifact } from "@/components/hero-artifact";
import { HeroButtons } from "@/components/hero-buttons";
import { PriceSection } from "@/components/price-section";
import { ProjectsSection } from "@/components/projects-section";
import { siteData } from "@/lib/data";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Header />
      <div className="px-4 sm:px-6 lg:px-8">
        <section className="relative grid min-h-[clamp(20rem,50vh,32rem)] grid-cols-1 gap-4 pb-6 pt-0 lg:grid-cols-12 lg:gap-8">
          <div className="relative order-1 flex min-h-[16rem] items-center lg:col-span-6 lg:min-h-0">
            <div className="absolute -inset-8 -z-10 bg-[radial-gradient(ellipse_at_left,rgba(245,194,200,0.12),transparent_64%)]" />
            <h1 className="font-xanmono text-balance max-w-[45rem] text-[clamp(2.3rem,3.7vw,3.7rem)] font-normal leading-[0.98] tracking-[-0.05em]">
              {siteData.heroNote}
            </h1>
          </div>

          <div className="relative order-2 flex min-h-[20rem] items-center justify-center lg:col-span-6 lg:min-h-0">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-70">
              <HeroArtifact />
            </div>
            <div className="relative z-10 ml-auto w-full max-w-[20rem]">
              <HeroButtons />
            </div>
          </div>
        </section>

        <ProjectsSection />
        <PriceSection />
        <Footer />
      </div>
    </main>
  );
}
