import Link from "next/link";
import { getVendedores } from "@/lib/api";

/**
 * El roster se lee de la corrida, nunca se hardcodea (08 §6): ya causó un error
 * real una vez — una ejecutiva desvinculada seguía en una lista copiada a mano.
 *
 * Son dos listas distintas y está bien: el scorecard exige volumen reciente, la
 * proyección individual exige 18 meses de historia. Acá se muestra la del
 * scorecard, que es el universo comparable.
 */
export async function SelectorEjecutivo() {
  const v = await getVendedores().catch(() => null);
  if (!v) return null;

  return (
    <nav className="flex flex-wrap items-center gap-1.5">
      <Link
        href="/"
        className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
      >
        Equipo
      </Link>
      {v.con_volumen_suficiente.map((nombre) => (
        <Link
          key={nombre}
          href={`/ejecutivo/${encodeURIComponent(nombre)}`}
          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
        >
          {nombre.split(" ")[0]}
        </Link>
      ))}
    </nav>
  );
}
