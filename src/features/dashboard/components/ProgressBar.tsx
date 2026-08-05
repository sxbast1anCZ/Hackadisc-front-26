import { cn } from "@/lib/utils";

interface ProgressBarProps {
  percent: number | null;
  label: string;
}

function getFillColor(percent: number): string {
  if (percent < 40) return "bg-rose-500";
  if (percent < 75) return "bg-amber-500";
  return "bg-emerald-500";
}

export function ProgressBar({ percent, label }: ProgressBarProps) {
  const clamped = percent === null ? 0 : Math.min(100, Math.max(0, percent));

  return (
    <div className="relative h-6 w-full overflow-hidden rounded-full bg-slate-200">
      {percent !== null && (
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full",
            getFillColor(percent)
          )}
          style={{ width: `${clamped}%` }}
        />
      )}
      <span className="relative flex h-full items-center justify-center text-[11px] font-medium text-slate-700">
        {percent === null ? "–" : label}
      </span>
    </div>
  );
}
