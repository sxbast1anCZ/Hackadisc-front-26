import type {
  ChartPoint,
  IndicatorCell,
  KpiStat,
  PerformanceIndicatorRow,
  SalesDetailRow,
} from "@/features/dashboard/types";

export const vendors: string[] = [
  "Ana Torres",
  "Diego Fuentes",
  "Camila Rojas",
  "Felipe Soto",
  "Valentina Muñoz",
];

export const kpis: {
  metaGeneral: KpiStat;
  ventasMes: KpiStat;
  ventasTerminadas: KpiStat;
} = {
  metaGeneral: {
    primaryLabel: "Meta General de Agosto",
    primaryValue: 200_000_000,
    deltaPercent: 64.8,
    direction: "down",
    secondaryLabel: "Monto por Vender",
    secondaryValue: 129_567_436,
  },
  ventasMes: {
    primaryLabel: "Ventas de Agosto",
    primaryValue: 70_432_564,
    deltaPercent: 26.2,
    direction: "down",
    secondaryLabel: "Ventas de Julio",
    secondaryValue: 95_410_087,
  },
  ventasTerminadas: {
    primaryLabel: "Ventas Terminadas de Agosto",
    primaryValue: 0,
    deltaPercent: 0,
    direction: "neutral",
    secondaryLabel: "Ventas Terminadas de Julio",
    secondaryValue: 0,
  },
};

export const monthlySales: ChartPoint[] = [
  { month: "Agosto 2025", value: 280_490_558 },
  { month: "Septiembre 2025", value: 233_530_254 },
  { month: "Octubre 2025", value: 314_992_880 },
  { month: "Noviembre 2025", value: 292_117_361 },
  { month: "Diciembre 2025", value: 348_941_777 },
  { month: "Enero 2026", value: 290_281_060 },
  { month: "Febrero 2026", value: 309_604_840 },
  { month: "Marzo 2026", value: 402_505_562 },
  { month: "Abril 2026", value: 411_850_279 },
  { month: "Mayo 2026", value: 387_256_593 },
  { month: "Junio 2026", value: 441_278_879 },
  { month: "Julio 2026", value: 473_856_409 },
];

function zeroForAllVendors(): Record<string, number> {
  return Object.fromEntries(vendors.map((vendor) => [vendor, 0]));
}

const enProceso: SalesDetailRow = {
  key: "enProceso",
  label: "En Proceso",
  amountsByVendor: {
    "Ana Torres": 5_880_000,
    "Diego Fuentes": 3_369_400,
    "Camila Rojas": 3_258_871,
    "Felipe Soto": 1_362_667,
    "Valentina Muñoz": 0,
  },
};

const enProcesoHistorico: SalesDetailRow = {
  key: "enProcesoHistorico",
  label: "En Proceso Histórico",
  amountsByVendor: {
    "Ana Torres": 244_382_814,
    "Diego Fuentes": 163_753_222,
    "Camila Rojas": 50_225_639,
    "Felipe Soto": 49_135_661,
    "Valentina Muñoz": 21_437_000,
  },
};

const canceladas: SalesDetailRow = {
  key: "canceladas",
  label: "Canceladas",
  amountsByVendor: zeroForAllVendors(),
};

const terminadas: SalesDetailRow = {
  key: "terminadas",
  label: "Terminadas",
  amountsByVendor: zeroForAllVendors(),
};

const terminadasSence: SalesDetailRow = {
  key: "terminadasSence",
  label: "Terminadas Sence",
  amountsByVendor: zeroForAllVendors(),
};

function buildTotalRow(rows: SalesDetailRow[]): SalesDetailRow {
  const amountsByVendor = Object.fromEntries(
    vendors.map((vendor) => [
      vendor,
      rows.reduce((sum, row) => sum + (row.amountsByVendor[vendor] ?? 0), 0),
    ])
  );
  return { key: "total", label: "Total", amountsByVendor };
}

const rowsBeforeTotal = [
  enProceso,
  enProcesoHistorico,
  canceladas,
  terminadas,
  terminadasSence,
];

export const salesDetailRows: SalesDetailRow[] = [
  ...rowsBeforeTotal,
  buildTotalRow(rowsBeforeTotal),
];

function cell(current: number, target: number | null): IndicatorCell {
  return { current, target };
}

export const performanceIndicators: PerformanceIndicatorRow[] = [
  {
    id: "nivel-ventas",
    label: "Nivel de Ventas",
    hasDetailButton: false,
    cellsByVendor: {
      "Ana Torres": cell(29_651_237, 40_000_000),
      "Diego Fuentes": cell(17_280_309, 40_000_000),
      "Camila Rojas": cell(16_765_199, 40_000_000),
      "Felipe Soto": cell(4_759_819, 40_000_000),
      "Valentina Muñoz": cell(1_976_000, 40_000_000),
    },
  },
  {
    id: "campanas-comerciales",
    label: "Campañas Comerciales: Reuniones con Clientes",
    hasDetailButton: true,
    cellsByVendor: {
      "Ana Torres": cell(2, 12),
      "Diego Fuentes": cell(0, 12),
      "Camila Rojas": cell(0, 12),
      "Felipe Soto": cell(0, 12),
      "Valentina Muñoz": cell(0, 12),
    },
  },
  {
    id: "clientes-nuevos",
    label: "Clientes Nuevos",
    hasDetailButton: true,
    cellsByVendor: {
      "Ana Torres": cell(0, 4),
      "Diego Fuentes": cell(1, 4),
      "Camila Rojas": cell(0, 4),
      "Felipe Soto": cell(0, 4),
      "Valentina Muñoz": cell(0, 4),
    },
  },
  {
    id: "clientes-recuperados",
    label: "Clientes Recuperados",
    hasDetailButton: true,
    cellsByVendor: {
      "Ana Torres": cell(0, 4),
      "Diego Fuentes": cell(0, 4),
      "Camila Rojas": cell(0, 4),
      "Felipe Soto": cell(0, 4),
      "Valentina Muñoz": cell(0, 4),
    },
  },
  {
    id: "eficacia-comercial",
    label: "Eficacia Comercial | R51 Comercializados",
    hasDetailButton: false,
    cellsByVendor: {
      "Ana Torres": cell(0, 1),
      "Diego Fuentes": null,
      "Camila Rojas": null,
      "Felipe Soto": null,
      "Valentina Muñoz": null,
    },
  },
  {
    id: "tasa-exito-cotizaciones",
    label: "Tasa de Éxito Cotizaciones",
    hasDetailButton: false,
    cellsByVendor: {
      "Ana Torres": cell(0, 1),
      "Diego Fuentes": cell(0, 3),
      "Camila Rojas": cell(1, 3),
      "Felipe Soto": cell(1, 1),
      "Valentina Muñoz": null,
    },
  },
  {
    id: "cursos-ejecutados",
    label: "Cursos Ejecutados",
    hasDetailButton: false,
    cellsByVendor: {
      "Ana Torres": cell(12, 12),
      "Diego Fuentes": cell(5, 5),
      "Camila Rojas": cell(11, 11),
      "Felipe Soto": cell(2, 2),
      "Valentina Muñoz": null,
    },
  },
  {
    id: "comercializaciones-facturadas",
    label: "Comercializaciones Facturadas en el Mes",
    hasDetailButton: false,
    cellsByVendor: {
      "Ana Torres": cell(0, 12),
      "Diego Fuentes": cell(0, 5),
      "Camila Rojas": cell(0, 11),
      "Felipe Soto": cell(0, 2),
      "Valentina Muñoz": null,
    },
  },
  {
    id: "post-venta",
    label: "Post Venta",
    hasDetailButton: true,
    cellsByVendor: {
      "Ana Torres": cell(0, 1),
      "Diego Fuentes": null,
      "Camila Rojas": null,
      "Felipe Soto": null,
      "Valentina Muñoz": cell(0, 1),
    },
  },
];
