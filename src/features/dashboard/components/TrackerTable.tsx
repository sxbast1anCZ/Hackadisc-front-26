import { Card } from "@/components/ui/Card";
import { formatCLP } from "@/lib/utils";
import type { MesTracker } from "@/lib/api";

/**
 * 08 §2.1: tabla compacta, no un gráfico aparte. Responde exactamente lo que
 * pidió Insecap para el cierre de mes — "si esa proyección se cumplió o no" —
 * y es la evidencia de que la banda de incertidumbre está calibrada, no de que
 * el punto central acierte.
 */
export function TrackerTable({ meses }: { meses: MesTracker[] }) {
  return (
    <Card>
      <h2 className="text-base font-semibold text-slate-900">
        Proyectado vs. real, mes a mes
      </h2>
      <p className="mb-4 text-xs text-slate-500">
        Cada mes se proyectó con datos solo hasta el mes anterior. El ✓ indica que
        el real cayó dentro de la banda proyectada.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] text-sm">
          <thead>
            <tr className="border-b border-black/5 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="pb-2 font-medium">Mes</th>
              <th className="pb-2 text-right font-medium">Proyectado</th>
              <th className="pb-2 text-right font-medium">Real</th>
              <th className="pb-2 text-right font-medium">Error</th>
              <th className="pb-2 text-center font-medium">En banda</th>
              <th className="pb-2 text-center font-medium">Meta</th>
            </tr>
          </thead>
          <tbody>
            {meses.map((m) => (
              <tr key={m.mes} className="border-b border-black/5 last:border-0">
                <td className="py-2 font-medium text-slate-800">{m.mes}</td>
                <td className="py-2 text-right tabular-nums text-slate-500">
                  {formatCLP(m.proyectado)}
                </td>
                <td className="py-2 text-right tabular-nums text-slate-800">
                  {formatCLP(m.real)}
                </td>
                <td className="py-2 text-right tabular-nums text-slate-500">
                  {m["error_%"] > 0 ? "+" : ""}
                  {m["error_%"].toFixed(1)}%
                </td>
                <td className="py-2 text-center" title={m.veredicto_proyeccion}>
                  {m.dentro_de_banda ? (
                    <span className="text-emerald-600">✓</span>
                  ) : (
                    <span className="text-rose-500">✗</span>
                  )}
                </td>
                <td className="py-2 text-center text-xs tabular-nums text-slate-500">
                  {m.cumplio_meta ? `+${m["pct_sobre_meta"].toFixed(0)}%` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
