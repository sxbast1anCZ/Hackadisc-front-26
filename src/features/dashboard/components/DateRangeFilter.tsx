import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

function toInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getCurrentMonthRange(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start: toInputValue(start), end: toInputValue(end) };
}

export function DateRangeFilter() {
  const { start, end } = getCurrentMonthRange();

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-slate-400">Periodo de búsqueda:</span>
      <div className="flex items-center gap-2">
        <input
          type="date"
          defaultValue={start}
          aria-label="Fecha de inicio"
          className="rounded-full border border-black/10 px-3 py-1.5 text-xs text-slate-600"
        />
        <input
          type="date"
          defaultValue={end}
          aria-label="Fecha de término"
          className="rounded-full border border-black/10 px-3 py-1.5 text-xs text-slate-600"
        />
        <Button variant="secondary" className="gap-1 px-3 py-1.5 text-xs">
          Filtrar
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
