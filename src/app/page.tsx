import { DashboardShell } from "@/components/layout/DashboardShell";
import { CobranzaPanel } from "@/features/dashboard/components/CobranzaPanel";
import { ConversionTable } from "@/features/dashboard/components/ConversionTable";
import { ProyeccionCard } from "@/features/dashboard/components/ProyeccionCard";
import { RiesgoClientesPanel } from "@/features/dashboard/components/RiesgoClientesPanel";
import { ScorecardChart } from "@/features/dashboard/components/ScorecardChart";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { TrackerTable } from "@/features/dashboard/components/TrackerTable";
import { VentasChart } from "@/features/dashboard/components/VentasChart";
import { Card } from "@/components/ui/Card";
import { formatCLP } from "@/lib/utils";
import { getClientesRiesgo, getGerencial, getSerieVentas, hay } from "@/lib/api";


export default async function VistaGerencial() {
  const [g, serie, riesgo] = await Promise.all([
    getGerencial(),
    getSerieVentas(),
    getClientesRiesgo(undefined, undefined, 100),
  ]);

  const proyeccion = hay(g.proyeccion_cierre) ? g.proyeccion_cierre : null;
  const pipeline = g.pipeline_vigente;
  const perdido = g.valor_perdido;

  return (
    <DashboardShell
      titulo="Vista gerencial"
      periodo={g.periodo}
      snapshot={g.snapshot}
    >
      <div className="flex flex-col gap-6">
        {/* Fila 1 — las cuatro preguntas que un tablero gerencial tiene que responder */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <ProyeccionCard proyeccion={g.proyeccion_cierre} titulo={`Cierre proyectado ${g.periodo}`} />
          <StatCard
            label="Pipeline vigente"
            valor={formatCLP(pipeline.prospectivo.monto)}
            detalle={`${pipeline.prospectivo.n_operaciones} operaciones aún no terminadas`}
          />
          <StatCard
            label="Valor perdido (12m)"
            valor={formatCLP(perdido.monto_perdido)}
            detalle={`${perdido.perdido_pct}% de ${formatCLP(perdido.monto_cotizado)} cotizados`}
            tono="alerta"
          />
          {hay(g.riesgo_clientes) && (
            <StatCard
              label="Cartera en mora"
              valor={formatCLP(g.riesgo_clientes.riesgo_credito_alto_monto)}
              detalle={`${g.riesgo_clientes.riesgo_credito_alto} clientes en riesgo de crédito alto · foto de hoy, no tendencia`}
              tono="alerta"
            />
          )}
        </div>

        <VentasChart
          serie={serie}
          proyeccion={proyeccion}
          meta={proyeccion?.meta ?? g.avance_equipo.meta_mensual}
        />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {hay(g.tracker) && <TrackerTable meses={g.tracker.meses} />}
          <ScorecardChart filas={g.scorecard.ejecutivos} ejes={g.scorecard.ejes} />
        </div>

        <ConversionTable filas={g.conversion_por_ejecutivo} />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {hay(g.cobranza) && <CobranzaPanel cobranza={g.cobranza} />}
          {hay(g.riesgo_clientes) && (
            <RiesgoClientesPanel resumen={g.riesgo_clientes} clientes={riesgo.clientes} />
          )}
        </div>

        {/* Fila de contexto: dan escala, no disparan decisiones por sí solas */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Crecimiento interanual"
            valor={`+${g.crecimiento_interanual.crecimiento_pct}%`}
            detalle={`${formatCLP(g.crecimiento_interanual.monto_12m)} vs ${formatCLP(g.crecimiento_interanual.monto_12m_previos)} los 12m previos`}
            tono="tenue"
          />
          <StatCard
            label="Ticket mediano"
            valor={formatCLP(g.ticket_medio.mediana ?? 0)}
            detalle={`P25 ${formatCLP(g.ticket_medio.p25)} · P75 ${formatCLP(g.ticket_medio.p75)} — la media (${formatCLP(g.ticket_medio.media)}) va arrastrada por contratos grandes`}
            tono="tenue"
          />
          {/* 07: esto NO es pipeline, es higiene de datos. Va separado y etiquetado. */}
          <Card className="border-amber-200 bg-amber-50/40">
            <p className="text-xs font-medium text-amber-700">
              Higiene de datos — no es pipeline
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-700">
              {formatCLP(pipeline.vencido.monto)}
            </p>
            <p className="mt-1 text-[11px] leading-snug text-slate-600">
              {pipeline.vencido.n_operaciones} operaciones siguen &quot;En Proceso&quot; con
              su fecha de término ya pasada. Es un ticket operativo, no una cifra
              de negocio: sumarlas al pipeline lo inflaría {" "}
              {(
                (pipeline.vencido.monto + pipeline.prospectivo.monto) /
                pipeline.prospectivo.monto
              ).toFixed(1)}
              x.
            </p>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
