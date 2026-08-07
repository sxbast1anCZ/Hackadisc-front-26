"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/Card";
import type { FilaScorecard } from "@/lib/api";

const COLOR_EJE: Record<string, string> = {
  avance: "#369fdb",
  cartera: "#77a6f9",
  cobranza: "#69cdfa",
  conversion: "#94a3b8",
};

const ETIQUETA: Record<string, string> = {
  avance: "Avance vs meta",
  cartera: "Salud de cartera",
  cobranza: "Ciclo de cobranza",
  conversion: "Conversión",
};

/**
 * 08 §5: barras agrupadas por eje, NUNCA un gauge único. El propio diseño del
 * modelo 05 exige mostrar el desglose junto al score compuesto — un solo número
 * lo taparía, y con 6 ejecutivos no hay datos para un score que se sostenga solo.
 *
 * El eje de margen se eliminó: viene de la cotización, no de la venta, y el sesgo
 * va de 1,35x a 2,06x según el ejecutivo — un ranking no lo cancela.
 *
 * Cada valor es un percentil DENTRO del grupo con volumen material, no contra los
 * 17 vendedores históricos: comparar a Karen con alguien de 1 curso no es justo
 * para nadie.
 */
export function ScorecardChart({ filas, ejes }: { filas: FilaScorecard[]; ejes: string[] }) {
  const data = filas
    .slice()
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .map((f) => ({
      vendedor: f.vendedor.split(" ")[0],
      score: f.score,
      ...Object.fromEntries(ejes.map((e) => [e, f.ejes[e]])),
    }));

  return (
    <Card>
      <h2 className="text-base font-semibold text-slate-900">
        Desempeño por ejecutivo
      </h2>
      <p className="mb-4 text-xs text-slate-500">
        Percentil por eje dentro del grupo con volumen material. Se muestra el
        desglose, no un número compuesto: los ejes miden cosas distintas.
      </p>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" vertical={false} />
            <XAxis dataKey="vendedor" tick={{ fontSize: 12, fill: "#64748b" }} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 1]} tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(v, n) => [
                typeof v === "number" ? `p${Math.round(v * 100)}` : "sin datos",
                ETIQUETA[String(n)] ?? String(n),
              ]}
              contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
            />
            <Legend formatter={(n: string) => ETIQUETA[n] ?? n} wrapperStyle={{ fontSize: 11 }} />
            {ejes.map((e) => (
              <Bar key={e} dataKey={e} fill={COLOR_EJE[e] ?? "#cbd5e1"} radius={[3, 3, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
