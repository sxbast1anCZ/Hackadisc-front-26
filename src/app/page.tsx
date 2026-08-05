import { DashboardShell } from "@/components/layout/DashboardShell";
import { KpiCard } from "@/features/dashboard/components/KpiCard";
import { SalesChart } from "@/features/dashboard/components/SalesChart";
import { SalesDetailTable } from "@/features/dashboard/components/SalesDetailTable";
import { kpis } from "@/features/dashboard/data/mock";

export default function Home() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <KpiCard stat={kpis.metaGeneral} />
          <KpiCard stat={kpis.ventasMes} />
          <KpiCard stat={kpis.ventasTerminadas} />
        </div>
        <SalesChart />
        <SalesDetailTable />
      </div>
    </DashboardShell>
  );
}
