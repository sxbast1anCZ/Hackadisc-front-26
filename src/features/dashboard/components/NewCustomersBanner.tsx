import { ArrowRight } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import type { CustomerAvatar } from "@/features/dashboard/types";

interface NewCustomersBannerProps {
  count: number;
  avatars: CustomerAvatar[];
}

export function NewCustomersBanner({ count, avatars }: NewCustomersBannerProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-black/5 pt-4">
      <div>
        <p className="text-sm font-medium text-slate-900">
          {count} new customers today!
        </p>
        <p className="text-xs text-slate-400">
          Send a welcome message to all new customers.
        </p>
      </div>
      <div className="flex items-end gap-3">
        {avatars.map((avatar) => (
          <div key={avatar.name} className="flex w-12 flex-col items-center gap-1">
            <Avatar name={avatar.name} size="sm" />
            <span className="w-full truncate text-center text-[11px] text-slate-400">
              {avatar.name.split(" ")[0]}
            </span>
          </div>
        ))}
        <button
          type="button"
          aria-label="View all customers"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-slate-500 hover:bg-slate-50"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
