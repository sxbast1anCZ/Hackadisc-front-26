import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label": string;
}

export function IconButton({ className, children, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border border-black/5 bg-white text-slate-600 transition-colors hover:bg-slate-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
