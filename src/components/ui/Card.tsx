import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-black/5 bg-white p-5 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
