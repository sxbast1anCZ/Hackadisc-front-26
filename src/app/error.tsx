"use client";

/**
 * La causa #1 de que esto se dispare en la demo es que el backend no esté
 * arriba. El mensaje lo dice explícito en vez de mostrar un stack trace.
 */
export default function ErrorDeVista({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-6 text-center">
      <h1 className="text-xl font-semibold text-slate-900">
        No se pudieron cargar los datos
      </h1>
      <p className="max-w-md text-sm text-slate-500">
        Verifica que la API esté corriendo (<code>uvicorn app.main:app</code>) y
        que <code>NEXT_PUBLIC_API_URL</code> apunte a ella.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-azul-insecap-500 px-4 py-2 text-sm font-medium text-white"
      >
        Reintentar
      </button>
    </main>
  );
}
