import { DashboardShell } from "@/components/layout/DashboardShell";
import { OverviewCard } from "@/features/dashboard/components/OverviewCard";
import { ProductViewChart } from "@/features/dashboard/components/ProductViewChart";

export default function Home() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <OverviewCard />
        <ProductViewChart />
      </div>
    </DashboardShell>
  );
}
