import type { LucideIcon } from "lucide-react";
import { DeltaBadge } from "@/components/ui/Badge";
import { formatCompactNumber, formatNumber } from "@/lib/utils";
import type { OverviewStat } from "@/features/dashboard/types";

interface StatBlockProps {
  stat: OverviewStat;
  icon: LucideIcon;
  compact?: boolean;
}

export function StatBlock({ stat, icon: Icon, compact }: StatBlockProps) {
  const displayValue = compact
    ? formatCompactNumber(stat.value)
    : formatNumber(stat.value);

  return (
    <div className="flex flex-1 flex-col gap-3">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Icon className="h-4 w-4" />
        {stat.label}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-3xl font-semibold text-slate-900">
          {displayValue}
        </span>
        <DeltaBadge direction={stat.direction}>{stat.deltaPercent}%</DeltaBadge>
      </div>
      <span className="text-xs text-slate-400">vs last month</span>
    </div>
  );
}
