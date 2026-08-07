"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/Card";
import type { Forecast, SerieMes } from "@/lib/api";

const millones = (v: number) => `$${(v / 1e6).toFixed(0)}M`;

/**
 * 08 §2.1: histórico como línea sólida + los meses proyectados con banda IC95
 * sombreada + línea punteada en la meta. Es el mismo gráfico que ya genera el
 * modelo, solo interactivo.
 *
 * La banda se dibuja como dos áreas apiladas (base transparente + alto de la
 * banda) porque recharts no tiene un tipo "range" nativo.
 */
export function VentasChart({
  serie,
  proyeccion,
  meta,
}: {
  serie: SerieMes[];
  proyeccion?: Forecast | null;
  meta: number | null;
}) {
  const data: Record<string, number | string | null>[] = serie.map((p) => ({
    periodo: p.periodo,
    real: p.monto,
  }));

  if (proyeccion?.mostrar_proyeccion) {
    const ultimo = data.at(-1);
    // Ancla la banda en el último punto real para que no salga flotando.
    if (ultimo) {
      ultimo.bandaBase = ultimo.real as number;
      ultimo.bandaAlto = 0;
      ultimo.proyectado = ultimo.real as number;
    }
    data.push({
      periodo: proyeccion.periodo,
      real: null,
      proyectado: proyeccion.punto,
      bandaBase: proyeccion.min,
      bandaAlto: proyeccion.max - proyeccion.min,
    });
  }

  return (
    <Card>
      <h2 className="text-base font-semibold text-slate-900">Ventas mensuales</h2>
      <p className="mb-4 text-xs text-slate-500">
        Línea sólida = real. Tramo punteado con banda = proyección con intervalo
        de confianza 95%.
      </p>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" vertical={false} />
            <XAxis dataKey="periodo" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} minTickGap={16} />
            <YAxis tickFormatter={millones} tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(v, n) =>
                n === "bandaAlto" || n === "bandaBase"
                  ? []
                  : [millones(Number(v)), n === "real" ? "Real" : "Proyectado"]
              }
              contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
            />
            {meta && (
              <ReferenceLine
                y={meta}
                stroke="#94a3b8"
                strokeDasharray="6 4"
                label={{ value: `Meta ${millones(meta)}`, position: "insideTopLeft", fontSize: 11, fill: "#64748b" }}
              />
            )}
            <Area dataKey="bandaBase" stackId="banda" stroke="none" fill="transparent" isAnimationActive={false} />
            <Area dataKey="bandaAlto" stackId="banda" stroke="none" fill="#69cdfa" fillOpacity={0.22} isAnimationActive={false} />
            <Line type="monotone" dataKey="real" stroke="#369fdb" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="proyectado" stroke="#369fdb" strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
