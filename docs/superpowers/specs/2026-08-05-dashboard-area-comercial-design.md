# Diseño: Dashboard Área Comercial (adaptación del dashboard real de Insecap)

## Contexto

El proyecto tenía un dashboard placeholder ([[2026-08-04-dashboard-ui-design.md]]) que
replicaba visualmente un mockup genérico de e-commerce (UI8), con datos mock en USD:
overview de clientes/balance, gráfico "Product view", "Popular products" y "Comments".
Ese contenido no representa el dominio real del proyecto.

El usuario compartió capturas del dashboard "Área Comercial" que Insecap usa actualmente
en producción: tarjetas KPI de metas y ventas del mes, un gráfico de barras de ventas de
los últimos 12 meses, una tabla de detalle de ventas por vendedor y una tabla de
indicadores de desempeño por vendedor. Esta tarea reemplaza el dashboard placeholder por
una adaptación de ese dashboard real a la paleta e infraestructura visual del proyecto
(`components/ui`, `components/layout`, paleta azul-insecap).

Backend/API aún no existen — igual que el dashboard placeholder, todo sigue siendo
**100% mock local**, sin llamadas de red.

## Alcance

- Reemplazo completo de `src/app/page.tsx` y de `features/dashboard/*` (components,
  data, types) por el nuevo dashboard.
- Las 4 secciones del dashboard real: KPIs, gráfico de ventas de 12 meses, tabla de
  detalle de ventas por vendedor, tabla de indicadores de desempeño por vendedor.
- Ajuste de `Sidebar` (un solo ítem de nav) y `Header` (título + filtro de fechas visual)
  para reflejar que este es el único dashboard real del proyecto.
- Formato de moneda en pesos chilenos (CLP).
- Datos mock con vendedores ficticios (nombres inventados, no los de las capturas
  reales de Insecap).

### Fuera de alcance

- Conexión a API/backend real — sigue siendo mock, como el resto del proyecto hasta ahora.
- Funcionalidad real del filtro de fechas (los inputs y el botón "Filtrar" son visuales;
  no recalculan los datos mostrados).
- Tooltips funcionales en los íconos "ⓘ" de las tablas, y acción real del botón
  "Ver Detalle" en la tabla de indicadores.
- Responsive mobile con colapso de sidebar a drawer (se mantiene el criterio
  desktop-first ya definido en el dashboard placeholder).
- Tests automatizados.
- Paleta de colores semántica formal (rojo/ámbar/verde) en `globals.css` — se aplican
  como utilidades puntuales de Tailwind, igual que se hizo con los badges del dashboard
  anterior.

## Estructura de carpetas

Se mantiene la separación `components/` (chrome reutilizable) vs `features/dashboard`
(específico del dominio) ya establecida. Cambios:

```
src/
├── app/
│   └── page.tsx                          # renderiza el nuevo dashboard
├── components/
│   ├── ui/                               # sin cambios de forma (Card, Avatar, Button,
│   │                                        IconButton); Badge gana variante "neutral"
│   └── layout/
│       ├── Sidebar.tsx                   # un solo ítem de nav
│       ├── Header.tsx                    # título + DateRangeFilter
│       └── DashboardShell.tsx            # sin cambios
├── features/
│   └── dashboard/
│       ├── components/
│       │   ├── DateRangeFilter.tsx
│       │   ├── KpiCard.tsx
│       │   ├── SalesChart.tsx
│       │   ├── SalesDetailTable.tsx
│       │   ├── PerformanceIndicatorsTable.tsx
│       │   └── ProgressBar.tsx           # compartido entre ambas tablas
│       ├── data/
│       │   └── mock.ts                   # kpis, monthlySales, vendors,
│       │                                    salesDetailRows, performanceIndicators
│       └── types.ts
└── lib/
    ├── utils.ts                          # + formatCLP; se retiran formatCurrency,
    │                                        formatNumber, formatCompactNumber (sin uso)
    └── nav-items.ts                      # un solo NavItem
```

## Componentes

- **`Sidebar`**: mismo layout visual (logo + columna de iconos), pero `navItems` queda
  con una sola entrada `{ id: "dashboard", label: "Dashboard", icon: LayoutGrid, href: "/" }`,
  activa. Se elimina el botón de chat inferior (era parte del chrome genérico, sin
  contraparte en el dashboard real).
- **`Header`**: título "Dashboard Área Comercial" a la izquierda; a la derecha,
  `DateRangeFilter` + `Avatar` del usuario. Se quitan buscador, botón "Create",
  notificaciones y chat.
- **`DateRangeFilter`**: dos `<input type="date">` (estilo consistente con los demás
  controles del proyecto, borde sutil redondeado) precargados con el primer y último día
  del mes actual, más un `Button variant="secondary"` "Filtrar" con ícono `ChevronDown`.
  Sin `onChange` funcional — estado inicial fijo, ya que no hay datos reales que filtrar.
- **`KpiCard`**: `Card` con stat primario (label en `azul-insecap-500`, valor grande en
  negro, `DeltaBadge` con nueva variante que usa `ChevronDown` en vez de flecha
  arriba/abajo) + separador (`border-t border-black/5`) + stat secundario (label y valor
  ambos en `azul-insecap-500`, más pequeños). Recibe los datos por props; se instancia 3
  veces en un grid `sm:grid-cols-3`.
- **`SalesChart`**: `Card` con título "$ Ventas de los últimos 12 meses"; `BarChart` de
  Recharts con eje Y (grillas horizontales suaves, ticks formateados en CLP compacto no
  hace falta — se muestran completos como en la captura) y eje X con las 12 etiquetas de
  mes; cada barra usa un color de una paleta fija de 6 tonos Tailwind en rotación
  (`#f472b6`, `#60a5fa`, `#fbbf24`, `#2dd4bf`, `#a78bfa`, `#fb923c`); `LabelList` encima
  de cada barra con el monto formateado en CLP.
- **`ProgressBar`**: barra base `bg-slate-200` + relleno cuyo color depende del `percent`
  recibido (ver umbrales abajo); si `percent` es `null` (sin dato/target), se muestra la
  barra vacía y un texto "–" en vez de porcentaje.
- **`SalesDetailTable`**: tabla con columna fija "Estado" + una columna por vendedor
  (`vendors` del mock). Filas: En Proceso, En Proceso Histórico, Canceladas, Terminadas,
  Terminadas Sence, Total (todas en CLP vía `formatCLP`), y Porcentaje Terminadas (usa
  `ProgressBar` con el % Terminadas/Total por vendedor). Envuelta en `overflow-x-auto`.
- **`PerformanceIndicatorsTable`**: misma estructura de tabla (columna "Indicador" +
  columna por vendedor). Cada celda usa `ProgressBar` con el texto "current / target"
  superpuesto (o "current / –" si no hay target) y el color por umbral. Filas cuyo
  indicador lo amerita (Campañas Comerciales, Clientes Nuevos, Clientes Recuperados, Post
  Venta, según la captura) incluyen un botón secundario pequeño "Ver Detalle" debajo de
  la barra, sin acción real. Envuelta en `overflow-x-auto`.

## Datos mock

`features/dashboard/types.ts`:

```ts
export type DeltaDirection = "up" | "down" | "neutral";

export interface KpiStat {
  primaryLabel: string;
  primaryValue: number;       // CLP
  deltaPercent: number;
  direction: DeltaDirection;
  secondaryLabel: string;
  secondaryValue: number;     // CLP
}

export interface ChartPoint {
  month: string;
  value: number;              // CLP
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
  amountsByVendor: Record<string, number>; // CLP
}

export interface IndicatorCell {
  current: number;
  target: number | null; // null = sin meta / no aplica ("–")
}

export interface PerformanceIndicatorRow {
  id: string;
  label: string;
  hasDetailButton: boolean;
  cellsByVendor: Record<string, IndicatorCell | null>; // null = sin dato
}
```

`features/dashboard/data/mock.ts` exporta:

- `vendors: string[]` — 5 nombres ficticios (ej. Ana Torres, Diego Fuentes, Camila Rojas,
  Felipe Soto, Valentina Muñoz).
- `kpis: { metaGeneral: KpiStat; ventasMes: KpiStat; ventasTerminadas: KpiStat }` —
  magnitudes calcadas de las capturas (cientos de millones CLP), con `direction`
  `"down"` para las dos primeras (caídas negativas) y `"neutral"` para Ventas
  Terminadas (0%, sin alza ni baja).
- `monthlySales: ChartPoint[]` — 12 puntos, Ago 2025 → Jul 2026, magnitudes similares a
  la captura (~$230M–$470M, con caída fuerte en los últimos 2 meses).
- `salesDetailRows: SalesDetailRow[]` — 6 filas (el "Total" se calcula como suma de las
  demás al construir el mock, no en el componente) × 5 vendedores.
- `performanceIndicators: PerformanceIndicatorRow[]` — 9 filas (Nivel de Ventas,
  Campañas Comerciales: Reuniones con Clientes, Clientes Nuevos, Clientes Recuperados,
  Eficacia Comercial, Tasa de Éxito Cotizaciones, Cursos Ejecutados, Comercializaciones
  Facturadas en el Mes, Post Venta) × 5 vendedores, con algunas celdas `target: null` o
  `null` completo para reflejar datos faltantes como en la captura real.

## Formato y estilo

- `formatCLP(value: number): string` en `lib/utils.ts` →
  ``` `$ ${new Intl.NumberFormat("es-CL").format(Math.round(value))}` ```.
  Reemplaza `formatCurrency`. `formatNumber` y `formatCompactNumber` se eliminan por
  quedar sin ningún consumidor tras el reemplazo del dashboard.
- Umbrales de color para `ProgressBar` (según `percent = current / target`):
  - Sin `target` o celda `null` → barra vacía gris (`bg-slate-200`), texto "–".
  - `percent < 40%` → relleno `bg-rose-500`.
  - `40% ≤ percent < 75%` → relleno `bg-amber-500`.
  - `percent ≥ 75%` → relleno `bg-emerald-500`.
- `DeltaBadge` (en `components/ui/Badge.tsx`) gana una tercera variante `direction:
  "neutral"` (fondo `bg-azul-insecap-500/10`, texto `azul-insecap-500`) además de las
  existentes `up`/`down`; las tres usan `ChevronDown` como ícono en vez de
  `ArrowUp`/`ArrowDown`, para igualar el estilo de píldora con flecha de la captura.
- Colores de marca (`azul-insecap-500/400/300`) se usan en labels y valores secundarios
  de los KPI, y en el filtro de fecha activo. Los colores semánticos (rojo/ámbar/verde
  de las barras de progreso, rojo/azul de los badges de variación) siguen el mismo
  criterio que ya estableció el dashboard placeholder: utilidades puntuales de Tailwind,
  no tokens nuevos en `globals.css`.
- Layout desktop-first, igual que antes: KPIs en grid de 3 columnas que se apila en
  pantallas angostas; ambas tablas con scroll horizontal propio (`overflow-x-auto`) en
  vez de romper el ancho de la página.

## Dependencias

Ninguna nueva — `recharts` y `lucide-react` ya están instaladas.
