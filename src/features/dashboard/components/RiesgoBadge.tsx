import { cn } from "@/lib/utils";

/**
 * 08 §4 y §6: los estados "sin operaciones resueltas" / "sin operaciones maduras"
 * / "sin historial suficiente" van en GRIS NEUTRO, nunca con el color de "bajo".
 * Aparecen en la misma columna pero significan "no sabemos", no "está bien" —
 * pintarlos igual es un error de lectura, no solo de estética.
 */
const COLORES: Record<string, string> = {
  alto: "bg-rose-50 text-rose-700 ring-rose-200",
  medio: "bg-amber-50 text-amber-700 ring-amber-200",
  bajo: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  si: "bg-rose-50 text-rose-700 ring-rose-200",
  no: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const SIN_DATOS = "bg-slate-100 text-slate-500 ring-slate-200";

export function RiesgoBadge({ valor, className }: { valor: string; className?: string }) {
  const esSinDatos = valor.startsWith("sin ");
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap",
        esSinDatos ? SIN_DATOS : COLORES[valor] ?? SIN_DATOS,
        className
      )}
      title={esSinDatos ? "Sin datos suficientes — no es 'riesgo bajo'" : undefined}
    >
      {esSinDatos ? "sin datos" : valor}
    </span>
  );
}

/** Semáforo de cobranza (03-B): acá el color ES la información (08 §3.2). */
export function SemaforoBadge({ valor }: { valor: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        valor === "rojo" && "bg-rose-50 text-rose-700 ring-rose-200",
        valor === "gris" && "bg-slate-100 text-slate-600 ring-slate-200",
        valor === "verde" && "bg-emerald-50 text-emerald-700 ring-emerald-200"
      )}
    >
      {valor}
    </span>
  );
}
