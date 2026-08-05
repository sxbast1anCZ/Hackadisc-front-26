import { DashboardShell } from "@/components/layout/DashboardShell";
import { OverviewCard } from "@/features/dashboard/components/OverviewCard";

export default function Home() {
  return (
    <DashboardShell>
      <OverviewCard />
    </DashboardShell>
  );
}
