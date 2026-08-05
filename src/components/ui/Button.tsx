import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
        variant === "primary"
          ? "bg-azul-insecap-500 text-white hover:bg-azul-insecap-500/90"
          : "border border-black/10 bg-white text-slate-700 hover:bg-slate-50",
        className
      )}
      {...props}
    />
  );
}
