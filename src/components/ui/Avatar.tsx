import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  shape?: "circle" | "square";
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

const COLORS = [
  "bg-azul-insecap-500 text-white",
  "bg-azul-insecap-400 text-white",
  "bg-azul-insecap-300 text-slate-900",
  "bg-slate-700 text-white",
  "bg-slate-400 text-white",
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

function getColorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash + name.charCodeAt(i)) % COLORS.length;
  }
  return COLORS[hash];
}

export function Avatar({
  name,
  size = "md",
  shape = "circle",
  className,
}: AvatarProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center font-medium",
        shape === "circle" ? "rounded-full" : "rounded-xl",
        SIZE_CLASSES[size],
        getColorForName(name),
        className
      )}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}
