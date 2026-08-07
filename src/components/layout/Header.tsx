import { Avatar } from "@/components/ui/Avatar";
import { SelectorEjecutivo } from "@/features/dashboard/components/SelectorEjecutivo";

/**
 * El snapshot va siempre visible junto al título: toda cifra derivada de los
 * modelos es válida *a esa fecha*, no en tiempo real (06 §10.1).
 */
export function Header({
  titulo,
  periodo,
  snapshot,
}: {
  titulo: string;
  periodo?: string;
  snapshot?: string | null;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-black/5 bg-white px-6 py-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{titulo}</h1>
        <p className="text-xs text-slate-400">
          {periodo && <>Período {periodo} · </>}
          {snapshot ? `datos al ${snapshot}` : "sin datos cargados"}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <SelectorEjecutivo />
        <Avatar name="Insecap" size="md" />
      </div>
    </header>
  );
}
