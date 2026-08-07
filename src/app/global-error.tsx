"use client";

/**
 * Boundary de último recurso: reemplaza al layout completo, así que tiene que
 * traer sus propios <html>/<body>.
 */
export default function ErrorGlobal({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center font-sans">
        <h1 className="text-xl font-semibold">Algo se rompió al cargar el dashboard</h1>
        <p className="max-w-md text-sm text-slate-500">
          Lo más probable es que la API no esté respondiendo.
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Reintentar
        </button>
      </body>
    </html>
  );
}
