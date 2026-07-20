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
        <section className="relative grid min-h-[clamp(22rem,62vh,38rem)] grid-cols-1 gap-6 pb-8 pt-2 lg:grid-cols-12 lg:grid-rows-[1fr_auto]">
          <div className="relative order-1 flex min-h-[18rem] items-center lg:col-span-6 lg:row-span-2 lg:min-h-0">
            <div className="absolute -inset-8 -z-10 bg-[radial-gradient(ellipse_at_left,rgba(245,194,200,0.12),transparent_64%)]" />
            <h1 className="font-xanmono text-balance max-w-[45rem] text-[clamp(2.25rem,3.75vw,3.75rem)] font-normal leading-[0.96] tracking-[-0.055em]">
              {siteData.heroNote}
            </h1>
          </div>

          <div className="order-2 flex min-h-[18rem] items-center justify-center lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:min-h-0">
            <HeroArtifact />
          </div>

          <div className="order-3 lg:col-span-3 lg:col-start-10 lg:row-start-2">
            <HeroButtons />
          </div>
        </section>

        <ProjectsSection />
        <PriceSection />
        <Footer />
      </div>
    </main>
  );
}
