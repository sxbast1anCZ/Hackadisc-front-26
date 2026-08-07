import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { CobranzaPanel } from "@/features/dashboard/components/CobranzaPanel";
import { ConversionTable } from "@/features/dashboard/components/ConversionTable";
import { FacturacionTable } from "@/features/dashboard/components/FacturacionTable";
import { ProyeccionCard } from "@/features/dashboard/components/ProyeccionCard";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { VentasChart } from "@/features/dashboard/components/VentasChart";
import { formatCLP } from "@/lib/utils";
import { getEjecutivo, getSerieVentas, getVendedores, hay } from "@/lib/api";


export default async function VistaEjecutivo({
  params,
}: {
  params: Promise<{ vendedor: string }>;
}) {
  const { vendedor: crudo } = await params;
  const vendedor = decodeURIComponent(crudo);

  const [e, serie, roster] = await Promise.all([
    getEjecutivo(vendedor),
    getSerieVentas(vendedor),
    getVendedores(),
  ]);

  const proyeccion = hay(e.proyeccion_individual) ? e.proyeccion_individual : null;
  const avance = e.avance_individual;
  const facturacion = hay(e.dias_a_facturacion.prediccion_vigentes)
    ? e.dias_a_facturacion.prediccion_vigentes
    : null;

  // Dos rosters distintos, a propósito. Sin esta nota parece un bug.
  const sinProyeccion =
    !roster.con_proyeccion_individual.includes(vendedor) &&
    roster.con_volumen_suficiente.includes(vendedor);

  return (
    <DashboardShell titulo={vendedor} periodo={e.periodo} snapshot={e.snapshot}>
      <div className="flex flex-col gap-6">
        {sinProyeccion && (
          <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
            {vendedor.split(" ")[0]} tiene datos suficientes para el scorecard de
            desempeño reciente, pero no los 18 meses de historia que requiere el
            modelo de proyección individual — no es una inconsistencia.
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <ProyeccionCard
            proyeccion={e.proyeccion_individual}
            titulo={`Cierre proyectado ${e.periodo}`}
          />
          <StatCard
            label="Avance vs. meta"
            valor={`${avance.progreso_pct?.toFixed(0)}%`}
            detalle={`${formatCLP(avance.venta_real)} de ${formatCLP(avance.meta_mensual)} — meta ponderada por volumen reciente, no plana`}
          />
          {e.conversion.propia && (
            <StatCard
              label="Conversión (12m)"
              valor={`${e.conversion.propia.conversion_pct.toFixed(1)}%`}
              detalle={`IC 95% ${e.conversion.propia.ic95_bajo}–${e.conversion.propia.ic95_alto} · n=${e.conversion.propia.n_cotizaciones}`}
            />
          )}
          {e.conversion.propia && (
            <StatCard
              label="Valor perdido (12m)"
              valor={formatCLP(e.conversion.propia.monto_perdido)}
              detalle={`${e.conversion.propia.perdido_pct}% de lo que cotizó`}
              tono="alerta"
            />
          )}
        </div>

        <VentasChart serie={serie} proyeccion={proyeccion} meta={avance.meta_mensual} />

        <ConversionTable filas={e.conversion.equipo} />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {hay(e.cobranza) && <CobranzaPanel cobranza={e.cobranza} />}
          <div className="flex flex-col gap-6">
            <Card>
              <h2 className="text-base font-semibold text-slate-900">
                Concentración de cartera
              </h2>
              <p className="mb-3 text-xs text-slate-500">
                Se mueve lento: es una conversación trimestral, no mensual.
              </p>
              <p className="text-2xl font-semibold text-slate-900">
                {e.concentracion_cartera.top1_pct}%
              </p>
              <p className="text-xs text-slate-500">
                en el cliente principal · top 3 = {e.concentracion_cartera.top3_pct}%
                · {e.concentracion_cartera.n_clientes} clientes en 12 meses
              </p>
            </Card>
            {facturacion && (
              <FacturacionTable
                operaciones={facturacion.operaciones}
                total={facturacion.n}
                mediana={e.dias_a_facturacion.mediana_dias}
              />
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
