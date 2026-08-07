import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { RiesgoBadge } from "./RiesgoBadge";
import { formatCLP } from "@/lib/utils";
import type { ClienteRiesgo, ResumenRiesgo } from "@/lib/api";

/**
 * 08 §4: una fila por cliente y los 4 ejes en columnas SEPARADAS, nunca
 * combinados en un score único. La correlación cancelación–mora es ≈ −0,05: son
 * fenómenos distintos, y un gauge único haría invisible al cliente que compra
 * bien pero no paga (o al revés).
 *
 * `riesgo_credito` va al final: los organizadores pidieron orientar el análisis
 * a compras, no a pagos, y el modelo ya lo degradó a eje secundario.
 */
export function RiesgoClientesPanel({
  resumen,
  clientes,
}: {
  resumen: ResumenRiesgo;
  clientes: ClienteRiesgo[];
}) {
  const tarjetas = [
    {
      label: "Riesgo alto de no-compra",
      valor: `${resumen.riesgo_compra_alto} clientes`,
      detalle: "su próxima comercialización puede no llegar a término",
    },
    {
      label: "Caída de volumen",
      valor: `${resumen.caida_volumen} clientes`,
      detalle: `${formatCLP(Math.abs(resumen.caida_volumen_monto))} de caída agregada`,
    },
    {
      label: "Riesgo de crédito alto",
      valor: `${resumen.riesgo_credito_alto} clientes`,
      detalle: `${formatCLP(resumen.riesgo_credito_alto_monto)} en mora`,
    },
  ];

  return (
    <Card>
      <h2 className="text-base font-semibold text-slate-900">Riesgo de clientes</h2>
      <p className="mb-4 text-xs text-slate-500">
        Cuatro ejes independientes, nunca combinados en un score único: miden
        fenómenos distintos y promediarlos esconde los casos que importan.
      </p>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {tarjetas.map((t) => (
          <div key={t.label} className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs font-medium text-azul-insecap-500">{t.label}</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{t.valor}</p>
            <p className="text-[11px] leading-tight text-slate-500">{t.detalle}</p>
          </div>
        ))}
      </div>

      <div className="max-h-96 overflow-auto">
        <table className="w-full min-w-[44rem] text-sm">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b border-black/5 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="pb-2 font-medium">Cliente</th>
              <th className="pb-2 font-medium">Compra</th>
              <th className="pb-2 font-medium">Fuga</th>
              <th className="pb-2 font-medium">Caída vol.</th>
              <th className="pb-2 text-right font-medium">Venta 12m</th>
              <th className="pb-2 font-medium text-slate-300">Crédito</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id_cliente} className="border-b border-black/5 last:border-0">
                <td className="py-2 pr-3">
                  <Link
                    href={`/clientes/${c.id_cliente}`}
                    className="font-medium text-slate-800 hover:text-azul-insecap-500"
                  >
                    {c.cliente}
                  </Link>
                </td>
                <td className="py-2"><RiesgoBadge valor={c.riesgo_compra} /></td>
                <td className="py-2"><RiesgoBadge valor={c.riesgo_fuga} /></td>
                <td className="py-2"><RiesgoBadge valor={c.alerta_caida_volumen} /></td>
                <td className="py-2 text-right tabular-nums text-slate-600">
                  {formatCLP(c.monto_total)}
                </td>
                {/* eje secundario: más chico y al final, siguiendo al modelo */}
                <td className="py-2 opacity-70">
                  <RiesgoBadge valor={c.riesgo_credito} className="scale-90" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
