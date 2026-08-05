import { DashboardShell } from "@/components/layout/DashboardShell";
import { KpiCard } from "@/features/dashboard/components/KpiCard";
import { kpis } from "@/features/dashboard/data/mock";

export default function Home() {
  return (
    <DashboardShell>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <KpiCard stat={kpis.metaGeneral} />
        <KpiCard stat={kpis.ventasMes} />
        <KpiCard stat={kpis.ventasTerminadas} />
      </div>
    </DashboardShell>
  );
}
