import type { ReactNode } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeltaBadgeProps {
  direction: "up" | "down";
  children: ReactNode;
}

export function DeltaBadge({ direction, children }: DeltaBadgeProps) {
  const isUp = direction === "up";
  const Icon = isUp ? ArrowUp : ArrowDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        isUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
      )}
    >
      <Icon className="h-3 w-3" />
      {children}
    </span>
  );
}

interface StatusBadgeProps {
  status: "Active" | "Offline";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isActive = status === "Active";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
      )}
    >
      {status}
    </span>
  );
}
