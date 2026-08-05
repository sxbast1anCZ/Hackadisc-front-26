import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { popularProducts } from "@/features/dashboard/data/mock";

export function PopularProductsCard() {
  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-base font-semibold text-slate-900">Popular products</h2>
      <ul className="flex flex-col gap-4">
        {popularProducts.map((product) => (
          <li key={product.id} className="flex items-center gap-3">
            <Avatar name={product.name} shape="square" />
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-medium text-slate-900">
                {product.name}
              </span>
              <span className="text-xs text-slate-400">
                {formatCurrency(product.price)}
              </span>
            </div>
            <StatusBadge status={product.status} />
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="rounded-full border border-black/10 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
      >
        All products
      </button>
    </Card>
  );
}
