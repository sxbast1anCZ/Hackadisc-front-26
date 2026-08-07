import Link from "next/link";

export default function NoEncontrado() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-6 text-center">
      <p className="text-sm font-medium text-azul-insecap-500">404</p>
      <h1 className="text-xl font-semibold text-slate-900">
        Esta página no existe
      </h1>
      <Link href="/" className="text-sm text-azul-insecap-500 hover:underline">
        Volver a la vista gerencial
      </Link>
    </main>
  );
}
