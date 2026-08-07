import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { SemaforoBadge } from "./RiesgoBadge";
import { formatCLP } from "@/lib/utils";
import type { Cobranza } from "@/lib/api";

const COLOR_BARRA: Record<string, string> = {
  rojo: "bg-rose-400",
  gris: "bg-slate-300",
  verde: "bg-emerald-400",
};

/**
 * 08 §3.2: el caso más claro de tabla pura. Ordenada por monto en riesgo
 * esperado (prob_mora × monto facturado), con el semáforo como badge — el color
 * es la información, no hace falta un gráfico para decir lo mismo.
 *
 * Encima, la barra apilada responde "¿cuánta plata está en riesgo?" sin bajar a
 * la lista completa. Son operaciones VIGENTES (facturadas y aún sin desenlace),
 * no el set de validación del backtest.
 */
export function CobranzaPanel({ cobranza }: { cobranza: Cobranza }) {
  const total = Object.values(cobranza.monto_por_semaforo).reduce((a, b) => a + b, 0);
  const bandas = ["rojo", "gris", "verde"].filter((s) => cobranza.monto_por_semaforo[s]);

  return (
    <Card>
      <div className="mb-1 flex items-baseline justify-between gap-4">
        <h2 className="text-base font-semibold text-slate-900">Cobranza — riesgo de mora</h2>
        <span className="text-xs text-slate-400">
          {cobranza.n_total} operaciones vigentes
        </span>
      </div>
      <p className="text-2xl font-semibold text-slate-900">
        {formatCLP(cobranza.monto_en_riesgo_esperado_total)}
      </p>
      <p className="mb-3 text-xs text-slate-500">
        en riesgo esperado (probabilidad × monto facturado)
      </p>

      <div className="mb-1 flex h-2.5 w-full overflow-hidden rounded-full">
        {bandas.map((s) => (
          <div
            key={s}
            className={COLOR_BARRA[s]}
            style={{ width: `${(cobranza.monto_por_semaforo[s] / total) * 100}%` }}
            title={`${s}: ${formatCLP(cobranza.monto_por_semaforo[s])}`}
          />
        ))}
      </div>
      <div className="mb-4 flex gap-4 text-[11px] text-slate-500">
        <span>{cobranza.n_rojos} rojos</span>
        <span>{cobranza.n_grises} grises</span>
        <span>{cobranza.n_verdes} verdes</span>
      </div>

      <div className="max-h-80 overflow-auto">
        <table className="w-full min-w-[38rem] text-sm">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b border-black/5 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="pb-2 font-medium">Cliente</th>
              <th className="pb-2 font-medium">Ejecutivo</th>
              <th className="pb-2 font-medium">Semáforo</th>
              <th className="pb-2 text-right font-medium">Facturado</th>
              <th className="pb-2 text-right font-medium">En riesgo</th>
            </tr>
          </thead>
          <tbody>
            {cobranza.casos.map((c) => (
              <tr key={c.codigo} className="border-b border-black/5 last:border-0">
                <td className="py-2 pr-3">
                  <Link
                    href={`/clientes/${c.id_cliente}`}
                    className="font-medium text-slate-800 hover:text-azul-insecap-500"
                  >
                    {c.cliente}
                  </Link>
                  <span className="ml-1 text-[10px] text-slate-400">{c.codigo}</span>
                </td>
                <td className="py-2 pr-3 text-slate-500">{c.vendedor}</td>
                <td className="py-2"><SemaforoBadge valor={c.semaforo} /></td>
                <td className="py-2 text-right tabular-nums text-slate-600">
                  {formatCLP(c.monto_facturado)}
                </td>
                <td className="py-2 text-right tabular-nums font-medium text-slate-800">
                  {formatCLP(c.monto_en_riesgo_esperado)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
