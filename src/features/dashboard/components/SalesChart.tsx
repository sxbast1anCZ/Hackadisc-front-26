"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { formatCLP } from "@/lib/utils";
import { monthlySales } from "@/features/dashboard/data/mock";

const BAR_COLORS = [
  "#f472b6",
  "#60a5fa",
  "#fbbf24",
  "#2dd4bf",
  "#a78bfa",
  "#fb923c",
];

export function SalesChart() {
  return (
    <Card className="flex flex-col gap-5">
      <h2 className="text-base font-semibold text-slate-900">
        $ Ventas de los últimos 12 meses
      </h2>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlySales}
            margin={{ top: 24, right: 8, left: 8, bottom: 8 }}
          >
            <CartesianGrid vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={50}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickFormatter={(value) => formatCLP(Number(value))}
              width={100}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {monthlySales.map((point, index) => (
                <Cell
                  key={point.month}
                  fill={BAR_COLORS[index % BAR_COLORS.length]}
                />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                formatter={(value) => formatCLP(Number(value))}
                style={{ fontSize: 11, fill: "#334155" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
