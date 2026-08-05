"use client";

import { ChevronDown } from "lucide-react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Card } from "@/components/ui/Card";
import { formatCompactNumber } from "@/lib/utils";
import {
  productViewHighlightIndex,
  productViewSeries,
  productViewTotal,
} from "@/features/dashboard/data/mock";

const HIGHLIGHT_COLOR = "#369fdb";
const BASE_COLOR = "#e2e8f0";

export function ProductViewChart() {
  return (
    <Card className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Product view</h2>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-slate-600"
        >
          Last 7 days
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={productViewSeries} barCategoryGap="30%">
            <XAxis dataKey="label" axisLine={false} tickLine={false} hide />
            <Tooltip
              cursor={false}
              formatter={(value) => [`${value}m`, "Views"]}
            />
            <Bar dataKey="value" radius={[8, 8, 8, 8]}>
              {productViewSeries.map((point, index) => (
                <Cell
                  key={point.label}
                  fill={index === productViewHighlightIndex ? HIGHLIGHT_COLOR : BASE_COLOR}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <span className="text-3xl font-semibold text-slate-900">
        ${formatCompactNumber(productViewTotal)}
      </span>
    </Card>
  );
}
