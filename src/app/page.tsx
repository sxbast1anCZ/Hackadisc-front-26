import { DashboardShell } from "@/components/layout/DashboardShell";
import { OverviewCard } from "@/features/dashboard/components/OverviewCard";
import { PopularProductsCard } from "@/features/dashboard/components/PopularProductsCard";
import { ProductViewChart } from "@/features/dashboard/components/ProductViewChart";

export default function Home() {
  return (
    <DashboardShell>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          <OverviewCard />
          <ProductViewChart />
        </div>
        <div className="flex flex-col gap-6">
          <PopularProductsCard />
        </div>
      </div>
    </DashboardShell>
  );
}
