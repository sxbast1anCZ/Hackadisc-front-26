export type DeltaDirection = "up" | "down" | "neutral";

export interface KpiStat {
  primaryLabel: string;
  primaryValue: number;
  deltaPercent: number;
  direction: DeltaDirection;
  secondaryLabel: string;
  secondaryValue: number;
}

export interface ChartPoint {
  month: string;
  value: number;
}

export type SalesDetailRowKey =
  | "enProceso"
  | "enProcesoHistorico"
  | "canceladas"
  | "terminadas"
  | "terminadasSence"
  | "total";

export interface SalesDetailRow {
  key: SalesDetailRowKey;
  label: string;
  amountsByVendor: Record<string, number>;
}

export interface IndicatorCell {
  current: number;
  target: number | null;
}

export interface PerformanceIndicatorRow {
  id: string;
  label: string;
  hasDetailButton: boolean;
  cellsByVendor: Record<string, IndicatorCell | null>;
}
