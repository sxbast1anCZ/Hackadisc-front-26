import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

/**
 * Tarjeta de una cifra. `tono="alerta"` es para las que NO son buenas noticias
 * pero tampoco un semáforo (la higiene de datos, el valor perdido): tienen que
 * verse distinto de un KPI de salud sin volverse una alarma que se ignora.
 */
export function StatCard({
  label,
  valor,
  detalle,
  tono = "normal",
}: {
  label: string;
  valor: string;
  detalle?: ReactNode;
  tono?: "normal" | "alerta" | "tenue";
}) {
  return (
    <Card className={cn(tono === "alerta" && "border-amber-200 bg-amber-50/40")}>
      <p className="text-xs font-medium text-azul-insecap-500">{label}</p>
      <p
        className={cn(
          "mt-1 text-2xl font-semibold",
          tono === "tenue" ? "text-slate-500" : "text-slate-900"
        )}
      >
        {valor}
      </p>
      {detalle && (
        <p className="mt-1 text-[11px] leading-snug text-slate-500">{detalle}</p>
      )}
    </Card>
  );
}
