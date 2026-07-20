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
        <section className="relative flex min-h-[56vh] flex-col justify-between pb-8 pt-0 sm:min-h-[62vh]">
          <HeroArtifact />
          <div className="grid items-end gap-6 lg:grid-cols-12">
            <div className="relative lg:col-span-8">
              <div className="absolute -inset-8 -z-10 bg-[radial-gradient(ellipse_at_left,rgba(245,194,200,0.12),transparent_64%)]" />
              <p className="text-balance max-w-5xl text-[clamp(1.9rem,4.2vw,4.7rem)] font-normal leading-[0.98] tracking-[-0.055em]">{siteData.heroNote}</p>
            </div>
            <div className="lg:col-span-3 lg:col-start-10"><HeroButtons /></div>
          </div>
        </section>
        <ProjectsSection />
        <PriceSection />
        <Footer />
      </div>
    </main>
  );
}
