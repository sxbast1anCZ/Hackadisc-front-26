import { Card } from "@/components/ui/Card";
import { formatCLP } from "@/lib/utils";
import type { ConversionEjecutivo } from "@/lib/api";

/**
 * El KPI que reemplaza a la tasa de conversión global (07 §2 #1): esa nunca se
 * mueve (91,1%–95,9% en 15 trimestres) y ninguna decisión cambia con ella.
 *
 * La barra de IC 95% es el punto del widget: intervalos que no se solapan son
 * diferencia real, no azar, y eso se ve de un vistazo sin leer números. La
 * columna de pérdida en pesos es la que ordena — un ejecutivo puede convertir
 * 90% y perder un cuarto de todo lo que cotiza, porque pierde las grandes.
 */
export function ConversionTable({ filas }: { filas: ConversionEjecutivo[] }) {
  if (!filas.length) return null;

  // Escala común a todas las barras: comparar intervalos exige el mismo eje.
  const min = Math.floor(Math.min(...filas.map((f) => f.ic95_bajo)) - 2);
  const max = Math.ceil(Math.max(...filas.map((f) => f.ic95_alto)) + 1);
  const pos = (v: number) => ((v - min) / (max - min)) * 100;

  return (
    <Card>
      <div className="mb-1 flex items-baseline justify-between gap-4">
        <h2 className="text-base font-semibold text-slate-900">
          Conversión y pérdida por ejecutivo
        </h2>
        <span className="text-xs text-slate-400">últimos 12 meses</span>
      </div>
      <p className="mb-4 text-xs text-slate-500">
        Ordenado por pérdida, no por conversión. Barras que no se solapan =
        diferencia estadística real (IC 95%, Wilson).
      </p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[46rem] text-sm">
          <thead>
            <tr className="border-b border-black/5 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="pb-2 font-medium">Ejecutivo</th>
              <th className="pb-2 text-right font-medium">Conversión</th>
              <th className="w-56 pb-2 font-medium">IC 95%</th>
              <th className="pb-2 text-right font-medium">Cotizado</th>
              <th className="pb-2 text-right font-medium">Perdido</th>
              <th className="pb-2 text-right font-medium">% perdido</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f) => (
              <tr key={f.vendedor} className="border-b border-black/5 last:border-0">
                <td className="py-3 font-medium text-slate-800">{f.vendedor}</td>
                <td className="py-3 text-right tabular-nums text-slate-700">
                  {f.conversion_pct.toFixed(1)}%
                </td>
                <td className="py-3">
                  <div className="relative h-5" title={`${f.ic95_bajo}% – ${f.ic95_alto}%`}>
                    <div className="absolute top-1/2 h-px w-full bg-slate-100" />
                    <div
                      className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-azul-insecap-300"
                      style={{
                        left: `${pos(f.ic95_bajo)}%`,
                        width: `${pos(f.ic95_alto) - pos(f.ic95_bajo)}%`,
                      }}
                    />
                    <div
                      className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 bg-azul-insecap-500"
                      style={{ left: `${pos(f.conversion_pct)}%` }}
                    />
                  </div>
                  <div className="mt-0.5 text-[10px] tabular-nums text-slate-400">
                    {f.ic95_bajo.toFixed(1)} – {f.ic95_alto.toFixed(1)} · n={f.n_cotizaciones}
                  </div>
                </td>
                <td className="py-3 text-right tabular-nums text-slate-600">
                  {formatCLP(f.monto_cotizado)}
                </td>
                <td className="py-3 text-right tabular-nums font-medium text-slate-800">
                  {formatCLP(f.monto_perdido)}
                </td>
                <td className="py-3 text-right tabular-nums font-semibold text-rose-600">
                  {f.perdido_pct?.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
