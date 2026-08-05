import { ChevronDown, Users, Wallet } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { NewCustomersBanner } from "@/features/dashboard/components/NewCustomersBanner";
import { StatBlock } from "@/features/dashboard/components/StatBlock";
import {
  newCustomersToday,
  overviewStats,
  recentCustomerAvatars,
} from "@/features/dashboard/data/mock";

export function OverviewCard() {
  return (
    <Card className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Overview</h2>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-slate-600"
        >
          Last month
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex gap-6">
        <StatBlock stat={overviewStats.customers} icon={Users} />
        <StatBlock stat={overviewStats.balance} icon={Wallet} compact />
      </div>
      <NewCustomersBanner
        count={newCustomersToday}
        avatars={recentCustomerAvatars}
      />
    </Card>
  );
}
