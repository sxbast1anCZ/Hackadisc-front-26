import { Avatar } from "@/components/ui/Avatar";
import { DateRangeFilter } from "@/features/dashboard/components/DateRangeFilter";

export function Header() {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-black/5 bg-white px-6 py-4">
      <h1 className="text-2xl font-semibold text-slate-900">
        Dashboard Área Comercial
      </h1>
      <div className="flex items-center gap-4">
        <DateRangeFilter />
        <Avatar name="David Alvarez" size="md" />
      </div>
    </header>
  );
}
