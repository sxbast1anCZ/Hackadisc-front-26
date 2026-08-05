import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/features/dashboard/components/ProgressBar";
import { formatCLP } from "@/lib/utils";
import { salesDetailRows, vendors } from "@/features/dashboard/data/mock";
import type { SalesDetailRowKey } from "@/features/dashboard/types";

function findRow(key: SalesDetailRowKey) {
  return salesDetailRows.find((row) => row.key === key);
}

export function SalesDetailTable() {
  const terminadasRow = findRow("terminadas");
  const totalRow = findRow("total");

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-base font-semibold text-slate-900">Detalle de Ventas</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-48 py-2 text-left text-xs font-medium text-slate-400">
                Estado
              </th>
              {vendors.map((vendor) => (
                <th
                  key={vendor}
                  className="px-3 py-2 text-left text-xs font-medium text-azul-insecap-500"
                >
                  {vendor}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {salesDetailRows.map((row) => (
              <tr key={row.key} className="border-t border-black/5">
                <td className="py-3 text-xs text-slate-500">{row.label}</td>
                {vendors.map((vendor) => (
                  <td key={vendor} className="px-3 py-3 text-slate-900">
                    {formatCLP(row.amountsByVendor[vendor] ?? 0)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-black/5">
              <td className="py-3 text-xs text-slate-500">Porcentaje Terminadas</td>
              {vendors.map((vendor) => {
                const total = totalRow?.amountsByVendor[vendor] ?? 0;
                const terminadas = terminadasRow?.amountsByVendor[vendor] ?? 0;
                const percent = total > 0 ? (terminadas / total) * 100 : null;
                return (
                  <td key={vendor} className="px-3 py-3">
                    <ProgressBar
                      percent={percent}
                      label={percent === null ? "" : `${Math.round(percent)}%`}
                    />
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
}
