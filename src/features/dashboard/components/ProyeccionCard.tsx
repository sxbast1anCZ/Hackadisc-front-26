import { Card } from "@/components/ui/Card";
import { formatCLP } from "@/lib/utils";
import { hay, type Forecast, type Quizas } from "@/lib/api";

/**
 * 08 §2.1 y §2.2. Dos formas visuales distintas a propósito:
 *
 * - con proyección: punto grande + banda IC95.
 * - sin proyección (R² < 0): rango histórico en gris, SIN punto central y con la
 *   nota visible. Si se viera igual que el caso validado, el diseño estaría
 *   transmitiendo una confianza que los datos no respaldan.
 *
 * `prob_alcanzar_meta` va como badge neutro, nunca semáforo: el equipo supera la
 * meta hace 8 meses seguidos, un verde permanente se deja de mirar (08 §6).
 */
export function ProyeccionCard({
  proyeccion,
  titulo,
}: {
  proyeccion: Quizas<Forecast>;
  titulo: string;
}) {
  if (!hay(proyeccion)) {
    return (
      <Card>
        <p className="text-sm font-medium text-azul-insecap-500">{titulo}</p>
        <p className="mt-3 text-sm text-slate-400">
          Sin proyección disponible — el batch de modelos aún no corrió.
        </p>
      </Card>
    );
  }

  const meta = proyeccion.meta;
  const prob = proyeccion.prob_alcanzar_meta;

  return (
    <Card className="flex flex-col gap-3">
      <p className="text-sm font-medium text-azul-insecap-500">{titulo}</p>

      {proyeccion.mostrar_proyeccion ? (
        <>
          <p className="text-3xl font-semibold text-slate-900">
            {formatCLP(proyeccion.punto)}
          </p>
          <p className="text-sm text-slate-500">
            Banda 95%: {formatCLP(proyeccion.min)} – {formatCLP(proyeccion.max)}
          </p>
        </>
      ) : (
        <>
          <p className="text-2xl font-semibold text-slate-400">
            {formatCLP(proyeccion.rango_historico_bajo)} –{" "}
            {formatCLP(proyeccion.rango_historico_alto)}
          </p>
          <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-2 text-xs leading-relaxed text-slate-500">
            Sin proyección confiable. Se muestra el rango real de los últimos 6
            meses — el modelo no le gana a predecir el promedio (R²{" "}
            {proyeccion.R2?.toFixed(2)}).
          </p>
        </>
      )}

      <div className="flex items-center justify-between border-t border-black/5 pt-3 text-sm">
        <span className="text-slate-500">
          Meta {meta ? formatCLP(meta) : "—"}
        </span>
        {prob !== null && proyeccion.mostrar_proyeccion && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            P(meta) {(prob * 100).toFixed(0)}%
          </span>
        )}
      </div>
    </Card>
  );
}
