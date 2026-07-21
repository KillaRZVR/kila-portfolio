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
      <div className="flex flex-row gap-5 pt-10">
        <div className="w-1/3">
          <h2 className="text-lg font-bold">Процесс разработки</h2>
          <p>Описание процесса разработки</p>
        </div>
        <div className="w-2/3">
          <table className="table-auto border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2">День</th>
                <th className="px-4 py-2">Описание</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">1</td>
                <td className="border px-4 py-2">Созвон</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">2</td>
                <td className="border px-4 py-2">Создание макета</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">3</td>
                <td className="border px-4 py-2">Согласование</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">4</td>
                <td className="border px-4 py-2">Добавление функционала</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">5</td>
                <td className="border px-4 py-2">Финальный результат</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </footer>
  );
}