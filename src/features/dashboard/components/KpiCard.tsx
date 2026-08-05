import { DeltaBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatCLP } from "@/lib/utils";
import type { KpiStat } from "@/features/dashboard/types";

interface KpiCardProps {
  stat: KpiStat;
}

function formatPercent(stat: KpiStat): string {
  const sign = stat.direction === "down" ? "-" : "";
  return `${sign}${stat.deltaPercent.toFixed(1).replace(".", ",")}%`;
}

export function KpiCard({ stat }: KpiCardProps) {
  return (
    <Card className="flex flex-col items-center gap-4 text-center">
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-medium text-azul-insecap-500">
          {stat.primaryLabel}
        </span>
        <span className="text-2xl font-semibold text-slate-900">
          {formatCLP(stat.primaryValue)}
        </span>
        <DeltaBadge direction={stat.direction}>{formatPercent(stat)}</DeltaBadge>
      </div>
      <div className="flex w-full flex-col items-center gap-1 border-t border-black/5 pt-4">
        <span className="text-sm font-medium text-azul-insecap-500">
          {stat.secondaryLabel}
        </span>
        <span className="text-base font-semibold text-azul-insecap-500">
          {formatCLP(stat.secondaryValue)}
        </span>
      </div>
    </Card>
  );
}
