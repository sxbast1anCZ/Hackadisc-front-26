import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeltaBadgeProps {
  direction: "up" | "down" | "neutral";
  children: ReactNode;
}

export function DeltaBadge({ direction, children }: DeltaBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        direction === "up" && "bg-emerald-50 text-emerald-600",
        direction === "down" && "bg-rose-50 text-rose-600",
        direction === "neutral" && "bg-azul-insecap-500/10 text-azul-insecap-500"
      )}
    >
      {children}
      <ChevronDown className="h-3 w-3" />
    </span>
  );
}
