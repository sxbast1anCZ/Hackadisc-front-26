# Dashboard Área Comercial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current e-commerce placeholder dashboard with an adaptation of Insecap's real "Dashboard Área Comercial" — 3 KPI cards, a 12-month sales bar chart, a sales-detail table by vendor, and a performance-indicators table by vendor — using local mock data in CLP.

**Architecture:** Same feature-based structure as before: `src/components/ui` (domain-agnostic primitives), `src/components/layout` (app chrome: Sidebar, Header, DashboardShell), `src/features/dashboard` (everything specific to this screen — components, typed mock data). The old e-commerce components/data are deleted and replaced. `src/app/page.tsx` composes the new dashboard as a Server Component tree; only the bar chart is a Client Component (Recharts needs the DOM).

**Tech Stack:** Next.js 16.3.0 (App Router, Turbopack), React 19, TypeScript (strict), Tailwind CSS v4, `recharts` (bar chart), `lucide-react` (icons). No new dependencies.

## Global Constraints

- Next.js 16.3.0, App Router, TypeScript strict mode, path alias `@/*` → `./src/*`.
- Light-only app: no dark mode, no `dark:` classes, no theme toggle.
- Brand tokens only: `bg-background`, `text-foreground`, `azul-insecap-300`
  (`#69cdfa`), `azul-insecap-400` (`#77a6f9`), `azul-insecap-500` (`#369fdb`, base
  accent). Do not add new tokens to `globals.css` — semantic colors (progress-bar
  thresholds, delta badges) are plain Tailwind utilities (`rose-*`, `amber-*`,
  `emerald-*`), not new theme variables.
- No automated tests (explicit scope exclusion in the spec). Verify each task via
  `npx tsc --noEmit`, `npm run lint`, and manual check in the browser at
  `http://localhost:3000`.
- No network calls. All data is local mock in `features/dashboard/data/mock.ts`.
- No new dependencies — only `recharts` and `lucide-react`, both already installed.
- Currency values are formatted with `formatCLP` (CLP, `es-CL` grouping, no
  decimals, `"$ "` prefix) — not the old USD `formatCurrency`.
- Sidebar has exactly one nav item ("Dashboard", active, links to `/`). Header
  shows the page title and a visual-only date-range filter (no filtering logic).
- Progress-bar color thresholds: no target/no data → gray + "–"; `< 40%` → rose;
  `40%–74%` → amber; `≥ 75%` → emerald.
- Both dashboard tables scroll horizontally in their own `overflow-x-auto`
  wrapper instead of breaking the page width.
- Desktop-first responsive: KPI grid stacks on narrow screens; sidebar does not
  collapse into a drawer.
- Package manager: npm.
- Spec: `docs/superpowers/specs/2026-08-05-dashboard-area-comercial-design.md`.

---

## Task 1: Retire e-commerce mock/components; add new types, mock data, and format utils

**Files:**
- Delete: `src/features/dashboard/components/OverviewCard.tsx`
- Delete: `src/features/dashboard/components/StatBlock.tsx`
- Delete: `src/features/dashboard/components/NewCustomersBanner.tsx`
- Delete: `src/features/dashboard/components/ProductViewChart.tsx`
- Delete: `src/features/dashboard/components/PopularProductsCard.tsx`
- Delete: `src/features/dashboard/components/CommentsCard.tsx`
- Modify: `src/features/dashboard/types.ts` (full rewrite)
- Modify: `src/features/dashboard/data/mock.ts` (full rewrite)
- Modify: `src/lib/utils.ts` (full rewrite)
- Modify: `src/app/page.tsx` (temporary placeholder so the build stays green)

**Interfaces:**
- Produces: `cn(...inputs: (string | number | null | boolean | undefined)[]): string`
- Produces: `formatCLP(value: number): string`
- Produces: `type DeltaDirection = "up" | "down" | "neutral"`
- Produces: `interface KpiStat { primaryLabel: string; primaryValue: number; deltaPercent: number; direction: DeltaDirection; secondaryLabel: string; secondaryValue: number }`
- Produces: `interface ChartPoint { month: string; value: number }`
- Produces: `type SalesDetailRowKey = "enProceso" | "enProcesoHistorico" | "canceladas" | "terminadas" | "terminadasSence" | "total"`
- Produces: `interface SalesDetailRow { key: SalesDetailRowKey; label: string; amountsByVendor: Record<string, number> }`
- Produces: `interface IndicatorCell { current: number; target: number | null }`
- Produces: `interface PerformanceIndicatorRow { id: string; label: string; hasDetailButton: boolean; cellsByVendor: Record<string, IndicatorCell | null> }`
- Produces: `vendors: string[]`
- Produces: `kpis: { metaGeneral: KpiStat; ventasMes: KpiStat; ventasTerminadas: KpiStat }`
- Produces: `monthlySales: ChartPoint[]`
- Produces: `salesDetailRows: SalesDetailRow[]`
- Produces: `performanceIndicators: PerformanceIndicatorRow[]`

- [ ] **Step 1: Delete the old e-commerce dashboard components**

```bash
git rm src/features/dashboard/components/OverviewCard.tsx \
  src/features/dashboard/components/StatBlock.tsx \
  src/features/dashboard/components/NewCustomersBanner.tsx \
  src/features/dashboard/components/ProductViewChart.tsx \
  src/features/dashboard/components/PopularProductsCard.tsx \
  src/features/dashboard/components/CommentsCard.tsx
```

- [ ] **Step 2: Rewrite `src/features/dashboard/types.ts`**

```ts
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
```

- [ ] **Step 3: Rewrite `src/features/dashboard/data/mock.ts`**

```ts
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
```

- [ ] **Step 4: Rewrite `src/lib/utils.ts`**

```ts
type ClassValue = string | number | null | boolean | undefined;

export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(" ");
}

export function formatCLP(value: number): string {
  return `$ ${new Intl.NumberFormat("es-CL").format(Math.round(value))}`;
}
```

- [ ] **Step 5: Temporarily simplify `src/app/page.tsx`**

Replace the entire file contents with:

```tsx
import { DashboardShell } from "@/components/layout/DashboardShell";

export default function Home() {
  return (
    <DashboardShell>
      <p className="text-sm text-slate-400">Dashboard content goes here.</p>
    </DashboardShell>
  );
}
```

- [ ] **Step 6: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: no errors.

Run: `npm run dev` (skip if already running) and open `http://localhost:3000`.
Expected: the old sidebar/header still render (unchanged in this task), and the
main content area shows only the placeholder text.

- [ ] **Step 7: Commit**

```bash
git add src/features/dashboard/types.ts src/features/dashboard/data/mock.ts \
  src/lib/utils.ts src/app/page.tsx
git commit -m "feat: replace e-commerce mock data with Área Comercial dashboard data"
```

---

## Task 2: Sidebar simplification and new Header (title + date filter)

**Files:**
- Modify: `src/lib/nav-items.ts` (full rewrite — single nav item)
- Modify: `src/components/layout/Sidebar.tsx` (remove bottom chat button)
- Create: `src/features/dashboard/components/DateRangeFilter.tsx`
- Modify: `src/components/layout/Header.tsx` (full rewrite)

**Interfaces:**
- Consumes: `cn` from `@/lib/utils` (Task 1); `Button` from `@/components/ui/Button`; `Avatar` from `@/components/ui/Avatar`
- Produces: `interface NavItem { id: string; label: string; icon: LucideIcon; href: string | null }`
- Produces: `navItems: NavItem[]`
- Produces: `DateRangeFilter()` — no props.
- Produces: `Header()` — no props.

- [ ] **Step 1: Rewrite `src/lib/nav-items.ts`**

```ts
import type { LucideIcon } from "lucide-react";
import { LayoutGrid } from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string | null;
}

export const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid, href: "/" },
];
```

- [ ] **Step 2: Rewrite `src/components/layout/Sidebar.tsx`**

```tsx
import Link from "next/link";
import { Compass } from "lucide-react";
import { navItems } from "@/lib/nav-items";
import { cn } from "@/lib/utils";

export function Sidebar() {
  return (
    <aside className="flex w-20 flex-col items-center gap-8 border-r border-black/5 bg-white py-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
        <Compass className="h-5 w-5" />
      </div>
      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === "dashboard";
          const content = (
            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl transition-colors",
                isActive
                  ? "bg-azul-insecap-500/10 text-azul-insecap-500"
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              )}
              title={item.label}
            >
              <Icon className="h-5 w-5" />
            </div>
          );

          return item.href ? (
            <Link key={item.id} href={item.href} aria-label={item.label}>
              {content}
            </Link>
          ) : (
            <button
              key={item.id}
              type="button"
              aria-label={item.label}
              className="cursor-default"
            >
              {content}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
```

- [ ] **Step 3: Create `src/features/dashboard/components/DateRangeFilter.tsx`**

```tsx
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

function toInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getCurrentMonthRange(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start: toInputValue(start), end: toInputValue(end) };
}

export function DateRangeFilter() {
  const { start, end } = getCurrentMonthRange();

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-slate-400">Periodo de búsqueda:</span>
      <div className="flex items-center gap-2">
        <input
          type="date"
          defaultValue={start}
          aria-label="Fecha de inicio"
          className="rounded-full border border-black/10 px-3 py-1.5 text-xs text-slate-600"
        />
        <input
          type="date"
          defaultValue={end}
          aria-label="Fecha de término"
          className="rounded-full border border-black/10 px-3 py-1.5 text-xs text-slate-600"
        />
        <Button variant="secondary" className="gap-1 px-3 py-1.5 text-xs">
          Filtrar
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Rewrite `src/components/layout/Header.tsx`**

```tsx
import { Avatar } from "@/components/ui/Avatar";
import { DateRangeFilter } from "@/features/dashboard/components/DateRangeFilter";

export function Header() {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-black/5 bg-white px-6 py-4">
      <h1 className="text-2xl font-semibold text-slate-900">
        Dashboard Área Comercial
      </h1>
      <div className="flex items-center gap-4">
        <DateRangeFilter />
        <Avatar name="David Alvarez" size="md" />
      </div>
    </header>
  );
}
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: no errors.

Run: `npm run dev` (skip if already running) and open `http://localhost:3000`.
Expected: sidebar shows only the single "Dashboard" icon (tinted blue, active),
no chat bubble at the bottom. Header shows "Dashboard Área Comercial" on the
left; on the right, "Periodo de búsqueda:" with two date inputs preset to the
first/last day of the current month, a "Filtrar" button with a chevron, and
the user avatar.

- [ ] **Step 6: Commit**

```bash
git add src/lib/nav-items.ts src/components/layout/Sidebar.tsx \
  src/features/dashboard/components/DateRangeFilter.tsx \
  src/components/layout/Header.tsx
git commit -m "feat: simplify sidebar and replace header with title + date filter"
```

---

## Task 3: KPI cards

**Files:**
- Modify: `src/components/ui/Badge.tsx` (full rewrite — `DeltaBadge` gains `neutral`, drops `StatusBadge`)
- Create: `src/features/dashboard/components/KpiCard.tsx`
- Modify: `src/app/page.tsx` (render the 3 KPI cards)

**Interfaces:**
- Consumes: `Card` from `@/components/ui/Card`; `formatCLP` from `@/lib/utils` (Task 1); `KpiStat` type and `kpis` mock data from `@/features/dashboard/types` / `@/features/dashboard/data/mock` (Task 1)
- Produces: `DeltaBadge({ direction, children }: { direction: "up" | "down" | "neutral"; children: ReactNode })`
- Produces: `KpiCard({ stat }: { stat: KpiStat })`

- [ ] **Step 1: Rewrite `src/components/ui/Badge.tsx`**

```tsx
import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeltaBadgeProps {
  direction: "up" | "down" | "neutral";
  children: ReactNode;
}

export function DeltaBadge({ direction, children }: DeltaBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        direction === "up" && "bg-emerald-50 text-emerald-600",
        direction === "down" && "bg-rose-50 text-rose-600",
        direction === "neutral" && "bg-azul-insecap-500/10 text-azul-insecap-500"
      )}
    >
      {children}
      <ChevronDown className="h-3 w-3" />
    </span>
  );
}
```

- [ ] **Step 2: Create `src/features/dashboard/components/KpiCard.tsx`**

```tsx
import { DeltaBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatCLP } from "@/lib/utils";
import type { KpiStat } from "@/features/dashboard/types";

interface KpiCardProps {
  stat: KpiStat;
}

function formatPercent(stat: KpiStat): string {
  const sign = stat.direction === "down" ? "-" : "";
  return `${sign}${stat.deltaPercent.toFixed(1).replace(".", ",")}%`;
}

export function KpiCard({ stat }: KpiCardProps) {
  return (
    <Card className="flex flex-col items-center gap-4 text-center">
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-medium text-azul-insecap-500">
          {stat.primaryLabel}
        </span>
        <span className="text-2xl font-semibold text-slate-900">
          {formatCLP(stat.primaryValue)}
        </span>
        <DeltaBadge direction={stat.direction}>{formatPercent(stat)}</DeltaBadge>
      </div>
      <div className="flex w-full flex-col items-center gap-1 border-t border-black/5 pt-4">
        <span className="text-sm font-medium text-azul-insecap-500">
          {stat.secondaryLabel}
        </span>
        <span className="text-base font-semibold text-azul-insecap-500">
          {formatCLP(stat.secondaryValue)}
        </span>
      </div>
    </Card>
  );
}
```

- [ ] **Step 3: Update `src/app/page.tsx`**

Replace the entire file contents with:

```tsx
import { DashboardShell } from "@/components/layout/DashboardShell";
import { KpiCard } from "@/features/dashboard/components/KpiCard";
import { kpis } from "@/features/dashboard/data/mock";

export default function Home() {
  return (
    <DashboardShell>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <KpiCard stat={kpis.metaGeneral} />
        <KpiCard stat={kpis.ventasMes} />
        <KpiCard stat={kpis.ventasTerminadas} />
      </div>
    </DashboardShell>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: no errors.

Run: `npm run dev` (skip if already running) and open `http://localhost:3000`.
Expected: 3 KPI cards in a row (stacking on narrow screens). First card:
"Meta General de Agosto" / "$ 200.000.000" / red "-64,8%" badge / "Monto por
Vender" / "$ 129.567.436". Second: "Ventas de Agosto" / "$ 70.432.564" / red
"-26,2%" / "Ventas de Julio" / "$ 95.410.087". Third: "Ventas Terminadas de
Agosto" / "$ 0" / blue "0,0%" / "Ventas Terminadas de Julio" / "$ 0".

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/Badge.tsx src/features/dashboard/components/KpiCard.tsx \
  src/app/page.tsx
git commit -m "feat: add Área Comercial KPI cards"
```

---

## Task 4: 12-month sales bar chart

**Files:**
- Create: `src/features/dashboard/components/SalesChart.tsx`
- Modify: `src/app/page.tsx` (render `<SalesChart />` below the KPI grid)

**Interfaces:**
- Consumes: `Card` from `@/components/ui/Card`; `formatCLP` from `@/lib/utils` (Task 1); `monthlySales` mock data from `@/features/dashboard/data/mock` (Task 1)
- Produces: `SalesChart()` — no props. Client Component (`"use client"`).

- [ ] **Step 1: Create `src/features/dashboard/components/SalesChart.tsx`**

```tsx
"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { formatCLP } from "@/lib/utils";
import { monthlySales } from "@/features/dashboard/data/mock";

const BAR_COLORS = [
  "#f472b6",
  "#60a5fa",
  "#fbbf24",
  "#2dd4bf",
  "#a78bfa",
  "#fb923c",
];

export function SalesChart() {
  return (
    <Card className="flex flex-col gap-5">
      <h2 className="text-base font-semibold text-slate-900">
        $ Ventas de los últimos 12 meses
      </h2>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlySales}
            margin={{ top: 24, right: 8, left: 8, bottom: 8 }}
          >
            <CartesianGrid vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={50}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickFormatter={(value) => formatCLP(Number(value))}
              width={100}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {monthlySales.map((point, index) => (
                <Cell
                  key={point.month}
                  fill={BAR_COLORS[index % BAR_COLORS.length]}
                />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                formatter={(value) => formatCLP(Number(value))}
                style={{ fontSize: 11, fill: "#334155" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
```

- [ ] **Step 2: Update `src/app/page.tsx`**

Replace the entire file contents with:

```tsx
import { DashboardShell } from "@/components/layout/DashboardShell";
import { KpiCard } from "@/features/dashboard/components/KpiCard";
import { SalesChart } from "@/features/dashboard/components/SalesChart";
import { kpis } from "@/features/dashboard/data/mock";

export default function Home() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <KpiCard stat={kpis.metaGeneral} />
          <KpiCard stat={kpis.ventasMes} />
          <KpiCard stat={kpis.ventasTerminadas} />
        </div>
        <SalesChart />
      </div>
    </DashboardShell>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: no errors.

Run: `npm run dev` (skip if already running) and open `http://localhost:3000`.
Expected: below the KPI row, a "$ Ventas de los últimos 12 meses" card with 12
bars (Agosto 2025 → Julio 2026), each a different color, a CLP amount label
above each bar, angled month labels below, and horizontal gridlines with CLP
values on the Y axis.

- [ ] **Step 4: Commit**

```bash
git add src/features/dashboard/components/SalesChart.tsx src/app/page.tsx
git commit -m "feat: add 12-month sales bar chart"
```

---

## Task 5: Sales detail table by vendor

**Files:**
- Create: `src/features/dashboard/components/ProgressBar.tsx`
- Create: `src/features/dashboard/components/SalesDetailTable.tsx`
- Modify: `src/app/page.tsx` (render `<SalesDetailTable />` below the chart)

**Interfaces:**
- Consumes: `cn` from `@/lib/utils`; `Card` from `@/components/ui/Card`; `formatCLP` from `@/lib/utils`; `salesDetailRows`/`vendors` mock data from `@/features/dashboard/data/mock` (Task 1)
- Produces: `ProgressBar({ percent, label }: { percent: number | null; label: string })`
- Produces: `SalesDetailTable()` — no props.

- [ ] **Step 1: Create `src/features/dashboard/components/ProgressBar.tsx`**

```tsx
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  percent: number | null;
  label: string;
}

function getFillColor(percent: number): string {
  if (percent < 40) return "bg-rose-500";
  if (percent < 75) return "bg-amber-500";
  return "bg-emerald-500";
}

export function ProgressBar({ percent, label }: ProgressBarProps) {
  const clamped = percent === null ? 0 : Math.min(100, Math.max(0, percent));

  return (
    <div className="relative h-6 w-full overflow-hidden rounded-full bg-slate-200">
      {percent !== null && (
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full",
            getFillColor(percent)
          )}
          style={{ width: `${clamped}%` }}
        />
      )}
      <span className="relative flex h-full items-center justify-center text-[11px] font-medium text-slate-700">
        {percent === null ? "–" : label}
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/features/dashboard/components/SalesDetailTable.tsx`**

```tsx
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
```

- [ ] **Step 3: Update `src/app/page.tsx`**

Replace the entire file contents with:

```tsx
import { DashboardShell } from "@/components/layout/DashboardShell";
import { KpiCard } from "@/features/dashboard/components/KpiCard";
import { SalesChart } from "@/features/dashboard/components/SalesChart";
import { SalesDetailTable } from "@/features/dashboard/components/SalesDetailTable";
import { kpis } from "@/features/dashboard/data/mock";

export default function Home() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <KpiCard stat={kpis.metaGeneral} />
          <KpiCard stat={kpis.ventasMes} />
          <KpiCard stat={kpis.ventasTerminadas} />
        </div>
        <SalesChart />
        <SalesDetailTable />
      </div>
    </DashboardShell>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: no errors.

Run: `npm run dev` (skip if already running) and open `http://localhost:3000`.
Expected: below the chart, a "Detalle de Ventas" table with 5 vendor columns
and rows En Proceso / En Proceso Histórico / Canceladas / Terminadas /
Terminadas Sence / Total (all CLP amounts) plus a "Porcentaje Terminadas" row
with progress bars (gray/empty, since Terminadas is $0 for every vendor in the
mock). Shrink the window to confirm the table scrolls horizontally instead of
overflowing the page.

- [ ] **Step 5: Commit**

```bash
git add src/features/dashboard/components/ProgressBar.tsx \
  src/features/dashboard/components/SalesDetailTable.tsx src/app/page.tsx
git commit -m "feat: add sales detail table by vendor"
```

---

## Task 6: Performance indicators table and page/metadata finalization

**Files:**
- Create: `src/features/dashboard/components/PerformanceIndicatorsTable.tsx`
- Modify: `src/app/page.tsx` (render `<PerformanceIndicatorsTable />`, final composition)
- Modify: `src/app/layout.tsx:15-18` (update `metadata` title/description)

**Interfaces:**
- Consumes: `Card` from `@/components/ui/Card`; `ProgressBar` from `@/features/dashboard/components/ProgressBar` (Task 5); `performanceIndicators`/`vendors` mock data from `@/features/dashboard/data/mock` (Task 1)
- Produces: `PerformanceIndicatorsTable()` — no props.

- [ ] **Step 1: Create `src/features/dashboard/components/PerformanceIndicatorsTable.tsx`**

```tsx
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
```

- [ ] **Step 2: Update `src/app/page.tsx`**

Replace the entire file contents with:

```tsx
import { DashboardShell } from "@/components/layout/DashboardShell";
import { KpiCard } from "@/features/dashboard/components/KpiCard";
import { PerformanceIndicatorsTable } from "@/features/dashboard/components/PerformanceIndicatorsTable";
import { SalesChart } from "@/features/dashboard/components/SalesChart";
import { SalesDetailTable } from "@/features/dashboard/components/SalesDetailTable";
import { kpis } from "@/features/dashboard/data/mock";

export default function Home() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <KpiCard stat={kpis.metaGeneral} />
          <KpiCard stat={kpis.ventasMes} />
          <KpiCard stat={kpis.ventasTerminadas} />
        </div>
        <SalesChart />
        <SalesDetailTable />
        <PerformanceIndicatorsTable />
      </div>
    </DashboardShell>
  );
}
```

- [ ] **Step 3: Update metadata in `src/app/layout.tsx`**

In `src/app/layout.tsx`, replace:

```tsx
export const metadata: Metadata = {
  title: "Dashboard",
  description: "Hackadisc dashboard",
};
```

with:

```tsx
export const metadata: Metadata = {
  title: "Dashboard Área Comercial",
  description: "Dashboard Área Comercial de Insecap (datos de ejemplo)",
};
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: no errors.

Run: `npm run dev` (skip if already running) and open `http://localhost:3000`.
Expected: full dashboard — KPIs, chart, sales detail table, and below it an
"Indicadores de Desempeño" table with 9 indicator rows × 5 vendor columns.
Cells with data show a colored progress bar with "current / target" text
(red for <40%, amber for 40–74%, green for ≥75%); cells without a target show
an empty gray bar with "–". Rows Campañas Comerciales, Clientes Nuevos,
Clientes Recuperados, and Post Venta show a "Ver Detalle" link under cells
that have data. Browser tab title reads "Dashboard Área Comercial".

- [ ] **Step 5: Commit**

```bash
git add src/features/dashboard/components/PerformanceIndicatorsTable.tsx \
  src/app/page.tsx src/app/layout.tsx
git commit -m "feat: add performance indicators table and finalize dashboard page"
```

---

## Task 7: Final QA pass

**Files:** none up front (verification only; fix forward in the relevant files from
Tasks 1-6 if issues are found; may remove `src/components/ui/IconButton.tsx` — see
Step 3)

- [ ] **Step 1: Full production build**

Run: `npm run build`
Expected: build succeeds with no type or lint errors.

- [ ] **Step 2: Responsive check**

Run: `npm run dev` (skip if already running), open `http://localhost:3000`, and
use browser devtools to check at widths ~1440px (desktop), ~1024px, and
~768px (tablet).
Expected: the KPI grid is 3 columns at ≥`sm` (640px) and stacks to 1 column
below that. Both tables keep their own horizontal scrollbar at narrow widths
instead of widening the page. The sidebar stays fixed-width and visible at all
these widths (mobile drawer is out of scope per the spec).

- [ ] **Step 3: Remove unused `IconButton` primitive if no longer referenced**

The new `Header` no longer renders notification/chat icon buttons, so
`IconButton` may have zero remaining consumers.

Run: `grep -rn "IconButton" src/ --include=*.tsx --include=*.ts`
Expected: only the definition in `src/components/ui/IconButton.tsx` matches,
with no import/usage elsewhere. If that's the case, remove it:

```bash
git rm src/components/ui/IconButton.tsx
```

If some component still imports `IconButton`, leave the file in place and
skip the removal.

- [ ] **Step 4: Scan for leftover references to removed e-commerce code**

Run: `grep -rn "formatCurrency\|formatNumber\|formatCompactNumber\|StatusBadge\|ArrowUp\|ArrowDown" src/`
Expected: no matches (these were only used by the deleted e-commerce
components and the old `DeltaBadge`/`utils.ts` implementation).

- [ ] **Step 5: Compare against the reference screenshots**

Open the running dashboard next to the Insecap screenshots shared by the user
and confirm: header title "Dashboard Área Comercial" with the date-range
filter and "Filtrar" button; 3 KPI cards with the same labels, deltas, and
sub-stats (values will differ since vendor/amount data is mock, but the
structure and colors should match); 12-month bar chart with per-bar colors,
value labels, and CLP formatting; "Detalle de Ventas" table with the same row
labels (En Proceso, En Proceso Histórico, Canceladas, Terminadas, Terminadas
Sence, Total, Porcentaje Terminadas); "Indicadores de Desempeño" table with
the same 9 indicator labels and progress-bar styling. Note any visible
discrepancy and fix it in the relevant component file from Tasks 2-6.

- [ ] **Step 6: Commit (only if Steps 3–4 produced changes)**

```bash
git add -A
git commit -m "chore: remove unused IconButton primitive after header redesign"
```
