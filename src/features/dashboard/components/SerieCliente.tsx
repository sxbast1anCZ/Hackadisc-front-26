"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { formatCLP } from "@/lib/utils";
import type { SerieMes } from "@/lib/api";

const millones = (v: number) => `$${(v / 1e6).toFixed(1)}M`;

export function SerieCliente({ serie }: { serie: SerieMes[] }) {
  if (!serie.length) return null;
  const ultimos = serie.slice(-24);

  return (
    <Card>
      <h2 className="text-base font-semibold text-slate-900">Historia de compra</h2>
      <p className="mb-4 text-xs text-slate-500">
        Últimos {ultimos.length} meses con actividad.
      </p>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ultimos} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" vertical={false} />
            <XAxis dataKey="periodo" tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={false} minTickGap={12} />
            <YAxis tickFormatter={millones} tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(v) => [formatCLP(Number(v)), "Venta"]}
              contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
            />
            <Bar dataKey="monto" fill="#369fdb" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
