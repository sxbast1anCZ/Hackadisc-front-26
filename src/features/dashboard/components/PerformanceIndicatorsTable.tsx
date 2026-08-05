import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/features/dashboard/components/ProgressBar";
import { performanceIndicators, vendors } from "@/features/dashboard/data/mock";

export function PerformanceIndicatorsTable() {
  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-base font-semibold text-slate-900">
        Indicadores de Desempeño
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-56 py-2 text-left text-xs font-medium text-slate-400">
                Indicador
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
            {performanceIndicators.map((row) => (
              <tr key={row.id} className="border-t border-black/5">
                <td className="py-3 text-xs text-slate-500">{row.label}</td>
                {vendors.map((vendor) => {
                  const cellData = row.cellsByVendor[vendor];
                  if (!cellData || cellData.target === null) {
                    return (
                      <td key={vendor} className="px-3 py-3">
                        <ProgressBar percent={null} label="" />
                      </td>
                    );
                  }
                  const percent =
                    cellData.target > 0
                      ? (cellData.current / cellData.target) * 100
                      : 0;
                  return (
                    <td key={vendor} className="px-3 py-3">
                      <div className="flex flex-col items-start gap-1">
                        <ProgressBar
                          percent={percent}
                          label={`${cellData.current} / ${cellData.target}`}
                        />
                        {row.hasDetailButton && (
                          <button
                            type="button"
                            className="text-[11px] font-medium text-azul-insecap-500 hover:underline"
                          >
                            Ver Detalle
                          </button>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
