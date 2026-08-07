import { Card } from "@/components/ui/Card";
import type { OperacionFacturacion } from "@/lib/api";

/**
 * 08 §3.1: una barra de rango horizontal por fila, no dos columnas de números.
 * Se lee de un vistazo qué operación tiene el rango más ancho — es decir, cuál
 * es más incierta — sin tener que restar mentalmente.
 *
 * NUNCA se muestra el punto central: el R² del modelo 03-A es negativo y está
 * documentado. El rango es la salida honesta; el punto no lo es.
 */
export function FacturacionTable({
  operaciones,
  total,
  mediana,
}: {
  operaciones: OperacionFacturacion[];
  total: number;
  mediana: number | null;
}) {
  if (!operaciones.length) return null;

  const max = Math.max(...operaciones.map((o) => o.rango_p75));
  const filas = operaciones.slice(0, 12);

  return (
    <Card>
      <div className="mb-1 flex items-baseline justify-between gap-4">
        <h2 className="text-base font-semibold text-slate-900">
          Pendientes de facturar
        </h2>
        <span className="text-xs text-slate-400">{total} operaciones</span>
      </div>
      <p className="mb-4 text-xs text-slate-500">
        Rango esperado de días hasta facturación (P25–P75), nunca un día exacto.
        {mediana !== null && <> Mediana histórica: {mediana.toFixed(0)} días.</>}
      </p>
      <div className="flex flex-col gap-2">
        {filas.map((o) => (
          <div key={o.codigo} className="flex items-center gap-3 text-xs">
            <span className="w-40 shrink-0 truncate text-slate-700" title={o.cliente}>
              {o.cliente}
            </span>
            <div className="relative h-4 flex-1">
              <div className="absolute top-1/2 h-px w-full bg-slate-100" />
              <div
                className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-azul-insecap-300"
                style={{
                  left: `${(o.rango_p25 / max) * 100}%`,
                  width: `${((o.rango_p75 - o.rango_p25) / max) * 100}%`,
                }}
                title={`${o.rango_p25.toFixed(0)}–${o.rango_p75.toFixed(0)} días`}
              />
            </div>
            <span className="w-20 shrink-0 text-right tabular-nums text-slate-500">
              {o.rango_p25.toFixed(0)}–{o.rango_p75.toFixed(0)}d
            </span>
          </div>
        ))}
      </div>
      {total > filas.length && (
        <p className="mt-3 text-[11px] text-slate-400">
          Mostrando {filas.length} de {total}.
        </p>
      )}
    </Card>
  );
}
