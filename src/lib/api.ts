/**
 * Único punto de entrada a los datos. El front no calcula ningún KPI: si un
 * número no viene de acá, no se muestra.
 *
 * El backend ya aplica las reglas que no se pueden delegar a la UI — el gate de
 * proyección individual y la exclusión del margen operacional del cuerpo de las
 * vistas. Ver Hackadisc-back-26/README.md.
 */
const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`${path} respondió ${res.status}`);
  return res.json() as Promise<T>;
}

/** Bloques que pueden no estar si el batch de modelos no corrió. */
export type NoDisponible = { disponible: false; motivo?: string };
export type Quizas<T> = (T & { disponible: true }) | NoDisponible;

export function hay<T>(bloque: Quizas<T>): bloque is T & { disponible: true } {
  return bloque?.disponible === true;
}

// --- Proyección (modelo 02) --------------------------------------------------

type ForecastBase = {
  periodo: string;
  alcance: "equipo" | "vendedor";
  vendedor: string | null;
  meta: number | null;
  prob_alcanzar_meta: number | null;
  snapshot: string | null;
  R2: number | null;
};

/**
 * Dos formas mutuamente excluyentes a propósito: cuando el R² del ejecutivo es
 * negativo el backend no emite `punto` ni banda, solo el rango de los últimos 6
 * meses. El tipo obliga a distinguirlas — pintarlas igual sería darle a un punto
 * sin respaldo la misma confianza visual que a uno validado.
 */
export type Forecast = ForecastBase &
  (
    | { mostrar_proyeccion: true; punto: number; min: number; max: number; modelo: string }
    | {
        mostrar_proyeccion: false;
        rango_historico_bajo: number;
        rango_historico_alto: number;
        motivo: string;
      }
  );

export type MesTracker = {
  mes: string;
  proyectado: number;
  real: number;
  ic95_bajo: number;
  ic95_alto: number;
  error_millones: number;
  "error_%": number;
  dentro_de_banda: number | boolean;
  veredicto_proyeccion: string;
  meta: number;
  cumplio_meta: number | boolean;
  "pct_sobre_meta": number;
};

// --- KPIs deterministas ------------------------------------------------------

export type Avance = {
  meta_mensual: number;
  venta_real: number;
  progreso_pct: number;
  semaforo: string;
  [k: string]: unknown;
};

export type Pipeline = {
  corte: string;
  prospectivo: { monto: number; n_operaciones: number };
  vencido: { monto: number; n_operaciones: number; es_alerta_de_higiene: boolean; nota: string };
};

export type ValorPerdido = {
  monto_cotizado: number;
  monto_perdido: number;
  perdido_pct: number | null;
  n_cotizaciones: number;
};

export type ConversionEjecutivo = {
  vendedor: string;
  conversion_pct: number;
  ic95_bajo: number;
  ic95_alto: number;
  n_cotizaciones: number;
  monto_cotizado: number;
  monto_perdido: number;
  perdido_pct: number | null;
};

export type Crecimiento = {
  monto_12m: number;
  monto_12m_previos: number;
  crecimiento_pct: number | null;
};

export type TicketMedio = {
  mediana: number | null;
  p25: number;
  p75: number;
  media: number;
  maximo: number;
  n: number;
  nota: string;
};

export type FilaScorecard = {
  vendedor: string;
  periodo: string;
  score: number | null;
  ejes: Record<string, number | null>;
};

export type ResumenRiesgo = {
  total_clientes: number;
  riesgo_compra_alto: number;
  caida_volumen: number;
  caida_volumen_monto: number;
  riesgo_credito_alto: number;
  riesgo_credito_alto_monto: number;
};

export type CasoMora = {
  codigo: string;
  id_cliente: number;
  cliente: string;
  vendedor: string;
  monto_facturado: number;
  prob_mora: number;
  semaforo: "rojo" | "gris" | "verde";
  monto_en_riesgo_esperado: number;
};

export type Cobranza = {
  snapshot: string | null;
  casos: CasoMora[];
  n_total: number;
  monto_en_riesgo_esperado_total: number;
  n_rojos: number;
  n_grises: number;
  n_verdes: number;
  monto_por_semaforo: Record<string, number>;
};

export type OperacionFacturacion = {
  codigo: string;
  id_cliente: number;
  cliente: string;
  vendedor: string;
  rango_p25: number;
  rango_p75: number;
  dias_desde_termino: number;
};

export type ClienteRiesgo = {
  id_cliente: number;
  cliente: string;
  riesgo_compra: string;
  riesgo_fuga: string;
  alerta_caida_volumen: string;
  riesgo_credito: string;
  motivo: string;
  monto_total: number;
  monto_6m: number;
  tendencia_6m: number | null;
  caida_6m_monto: number | null;
  recencia_dias: number | null;
};

// --- Vistas ------------------------------------------------------------------

export type VistaGerencial = {
  periodo: string;
  snapshot: string | null;
  proyeccion_cierre: Quizas<Forecast>;
  tracker: Quizas<{ meses: MesTracker[] }>;
  avance_equipo: Avance;
  pipeline_vigente: Pipeline;
  crecimiento_interanual: Crecimiento;
  ticket_medio: TicketMedio;
  valor_perdido: ValorPerdido;
  conversion_por_ejecutivo: ConversionEjecutivo[];
  scorecard: { disponible: boolean; ejes: string[]; ejecutivos: FilaScorecard[] };
  riesgo_clientes: Quizas<ResumenRiesgo>;
  caja_en_mora: {
    riesgo_credito_alto: Quizas<ResumenRiesgo>;
    stock_bruto: { monto: number; n_casos: number; etiqueta: string };
    nota_metodologica: string;
  };
  cobranza: Quizas<Cobranza>;
  ejecutivos_atencion: Quizas<{
    ejecutivos: { vendedor: string; venta_real: number; proyeccion_min: number }[];
    sin_proyeccion_confiable: string[];
  }>;
};

export type VistaEjecutivo = {
  periodo: string;
  vendedor: string;
  snapshot: string | null;
  proyeccion_individual: Quizas<Forecast>;
  avance_individual: Avance;
  conversion: { propia: ConversionEjecutivo | null; equipo: ConversionEjecutivo[] };
  concentracion_cartera: { top1_pct: number | null; top3_pct: number | null; n_clientes: number; semaforo: string };
  dias_a_facturacion: {
    mediana_dias: number | null;
    p75_dias: number | null;
    prediccion_vigentes: Quizas<{ n: number; operaciones: OperacionFacturacion[] }>;
  };
  cobranza: Quizas<Cobranza>;
  ticket_medio: TicketMedio;
};

export type Vendedores = {
  periodo: string;
  con_volumen_suficiente: string[];
  con_proyeccion_individual: string[];
  volumen_insuficiente: string[];
  nota_rosters: string;
};

export type SerieMes = { periodo: string; monto: number };

export const getGerencial = (periodo?: string) =>
  api<VistaGerencial>(`/vista/gerencial${periodo ? `?periodo=${periodo}` : ""}`);

export const getEjecutivo = (vendedor: string, periodo?: string) =>
  api<VistaEjecutivo>(
    `/vista/ejecutivo/${encodeURIComponent(vendedor)}${periodo ? `?periodo=${periodo}` : ""}`
  );

export const getVendedores = (periodo?: string) =>
  api<Vendedores>(`/vendedores${periodo ? `?periodo=${periodo}` : ""}`);

export const getClientesRiesgo = (eje?: string, nivel?: string, limit = 100) =>
  api<{ disponible: boolean; n_total: number; resumen: Quizas<ResumenRiesgo>; clientes: ClienteRiesgo[] }>(
    `/clientes/riesgo?limit=${limit}${eje && nivel ? `&eje=${eje}&nivel=${nivel}` : ""}`
  );

export const getCobranzaMora = (vendedor?: string, limit = 25) =>
  api<Quizas<{ n_total: number; casos: CasoMora[] }>>(
    `/cobranza/mora?limit=${limit}${vendedor ? `&vendedor=${encodeURIComponent(vendedor)}` : ""}`
  );

/** Serie histórica mensual real. Los meses proyectados van aparte, no mezclados. */
export const getSerieVentas = (vendedor?: string, meses = 24) =>
  api<SerieMes[]>(
    `/serie/ventas?meses=${meses}${vendedor ? `&vendedor=${encodeURIComponent(vendedor)}` : ""}`
  );
