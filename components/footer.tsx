import { Separator } from "@/components/ui/separator";
import { siteData } from "@/lib/data";

export function Footer() {
  return (
    <footer className="pb-5 pt-16">
      <Separator className="opacity-40" />
      <div className="font-telemetry flex flex-col gap-3 pt-4 text-[10px] uppercase text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>{siteData.footer}</p>
        <a href="#top" className="rounded-full px-3 py-2 transition-colors hover:bg-foreground hover:text-background">↑ {siteData.brand}</a>
      </div>
    </footer>
  );
}
