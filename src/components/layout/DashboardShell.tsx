import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

interface DashboardShellProps {
  children: ReactNode;
  titulo: string;
  periodo?: string;
  snapshot?: string | null;
}

export function DashboardShell({ children, titulo, periodo, snapshot }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header titulo={titulo} periodo={periodo} snapshot={snapshot} />
        <main className="flex-1 bg-background px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
