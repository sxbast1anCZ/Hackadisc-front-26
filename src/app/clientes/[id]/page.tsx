import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { RiesgoBadge, SemaforoBadge } from "@/features/dashboard/components/RiesgoBadge";
import { SerieCliente } from "@/features/dashboard/components/SerieCliente";
import { formatCLP } from "@/lib/utils";
import { api, hay, type CasoMora, type ClienteRiesgo, type Quizas, type SerieMes } from "@/lib/api";

type Detalle = {
  id_cliente: number;
  snapshot: string | null;
  perfil_riesgo: Quizas<ClienteRiesgo>;
  serie_mensual: SerieMes[];
  operaciones_en_mora: CasoMora[];
};

const EJES: { key: keyof ClienteRiesgo; label: string }[] = [
  { key: "riesgo_compra", label: "Riesgo de no-compra" },
  { key: "riesgo_fuga", label: "Riesgo de fuga" },
  { key: "alerta_caida_volumen", label: "Caída de volumen" },
  { key: "riesgo_credito", label: "Riesgo de crédito" },
];

/**
 * Drill-down de 08 §4. Acá sí va el mini-gráfico de tendencia: a nivel de lista
 * completa sería ruido, a nivel de un cliente puntual es la pregunta que el
 * gerente hace justo después de ver el badge rojo.
 */

export default async function ClienteDetalle({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const d = await api<Detalle>(`/clientes/${id}`);
  const perfil = hay(d.perfil_riesgo) ? d.perfil_riesgo : null;

  return (
    <DashboardShell
      titulo={perfil?.cliente ?? `Cliente ${id}`}
      snapshot={d.snapshot}
    >
      <div className="flex flex-col gap-6">
        {perfil ? (
          <>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {EJES.map((e) => (
                <Card key={e.key}>
                  <p className="text-xs font-medium text-azul-insecap-500">{e.label}</p>
                  <div className="mt-2">
                    <RiesgoBadge valor={String(perfil[e.key])} />
                  </div>
                </Card>
              ))}
            </div>

            <Card>
              <p className="text-xs font-medium text-azul-insecap-500">Diagnóstico</p>
              <p className="mt-1 text-sm text-slate-700">{perfil.motivo}</p>
              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-black/5 pt-4 text-sm sm:grid-cols-4">
                <div>
                  <p className="text-xs text-slate-400">Venta histórica</p>
                  <p className="font-medium text-slate-800">{formatCLP(perfil.monto_total)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Últimos 6 meses</p>
                  <p className="font-medium text-slate-800">{formatCLP(perfil.monto_6m)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Última compra</p>
                  <p className="font-medium text-slate-800">
                    {perfil.recencia_dias !== null ? `hace ${Math.round(perfil.recencia_dias)} días` : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Caída semestral</p>
                  <p className="font-medium text-slate-800">
                    {perfil.caida_6m_monto ? formatCLP(Math.abs(perfil.caida_6m_monto)) : "—"}
                  </p>
                </div>
              </div>
            </Card>
          </>
        ) : (
          <Card>
            <p className="text-sm text-slate-500">
              Este cliente no tiene perfil de riesgo calculado en la corrida actual.
            </p>
          </Card>
        )}

        <SerieCliente serie={d.serie_mensual} />

        {d.operaciones_en_mora.length > 0 && (
          <Card>
            <h2 className="text-base font-semibold text-slate-900">
              Operaciones con riesgo de mora
            </h2>
            <p className="mb-3 text-xs text-slate-500">
              Facturadas y aún sin desenlace — {d.operaciones_en_mora.length} operaciones.
            </p>
            <div className="max-h-80 overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-black/5 text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="pb-2 font-medium">Código</th>
                    <th className="pb-2 font-medium">Semáforo</th>
                    <th className="pb-2 text-right font-medium">Facturado</th>
                    <th className="pb-2 text-right font-medium">En riesgo</th>
                  </tr>
                </thead>
                <tbody>
                  {d.operaciones_en_mora.map((o) => (
                    <tr key={o.codigo} className="border-b border-black/5 last:border-0">
                      <td className="py-2 text-slate-600">{o.codigo}</td>
                      <td className="py-2"><SemaforoBadge valor={o.semaforo} /></td>
                      <td className="py-2 text-right tabular-nums text-slate-600">
                        {formatCLP(o.monto_facturado)}
                      </td>
                      <td className="py-2 text-right tabular-nums font-medium text-slate-800">
                        {formatCLP(o.monto_en_riesgo_esperado)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
