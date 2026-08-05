# Dashboard UI Replica Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the visual dashboard shell (sidebar, header, KPI overview, bar chart, popular products, comments) shown in the reference mockup, using the project's azul-insecap palette and local mock data, with no backend connection yet.

**Architecture:** Feature-based structure on top of Next.js 16 App Router. `src/components/ui` holds domain-agnostic primitives (Card, Avatar, Badge, IconButton, Button). `src/components/layout` holds the app chrome (Sidebar, Header, DashboardShell). `src/features/dashboard` holds everything specific to this screen: composed components, typed mock data. `src/app/page.tsx` wires it all together as a Server Component tree; only the chart is a Client Component (Recharts needs the DOM).

**Tech Stack:** Next.js 16.3.0 (App Router, Turbopack), React 19, TypeScript (strict), Tailwind CSS v4, `recharts` (bar chart), `lucide-react` (icons).

## Global Constraints

- Next.js 16.3.0, App Router, TypeScript strict mode, path alias `@/*` → `./src/*`.
- Light-only app: no dark mode, no `dark:` classes, no theme toggle.
- Use the existing brand tokens only: `bg-background`, `text-foreground`,
  `azul-insecap-300` (`#69cdfa`), `azul-insecap-400` (`#77a6f9`),
  `azul-insecap-500` (`#369fdb`, base accent). Do not add new tokens to
  `globals.css` — semantic colors (success/error) are applied as plain Tailwind
  utilities (`emerald-*`, `rose-*`, `slate-*`), not new theme variables.
- No automated tests (explicit scope exclusion in the spec). Verify each task via
  `npx tsc --noEmit`, `npm run lint`, and manual check in the browser at
  `http://localhost:3000`.
- No network calls, no external image/avatar services. Avatars and product
  thumbnails are initials-on-color blocks rendered locally.
- Only two new dependencies allowed: `recharts`, `lucide-react`.
- Only "Dashboard" is a real, navigable sidebar item (links to `/`). All other
  sidebar items are visual only (no `href`, not clickable-navigable).
- Desktop-first responsive: content grid stacks on narrow screens, but the
  sidebar does not collapse into a drawer.
- Package manager: npm.
- Spec: `docs/superpowers/specs/2026-08-04-dashboard-ui-design.md`.

---

## Task 1: Dependencies, formatting utils, and nav config

**Files:**
- Modify: `package.json` (add `recharts`, `lucide-react`)
- Create: `src/lib/utils.ts`
- Create: `src/lib/nav-items.ts`

**Interfaces:**
- Produces: `cn(...inputs: (string | number | null | boolean | undefined)[]): string`
- Produces: `formatNumber(value: number): string`
- Produces: `formatCurrency(value: number): string`
- Produces: `formatCompactNumber(value: number): string`
- Produces: `interface NavItem { id: string; label: string; icon: LucideIcon; href: string | null; expandable?: boolean }`
- Produces: `navItems: NavItem[]`

- [ ] **Step 1: Install dependencies**

Run: `npm install recharts lucide-react`

- [ ] **Step 2: Create `src/lib/utils.ts`**

```ts
type ClassValue = string | number | null | boolean | undefined;

export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(" ");
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${trimTrailingZero(value / 1_000_000)}m`;
  }
  if (value >= 1_000) {
    return `${trimTrailingZero(value / 1_000)}k`;
  }
  return `${value}`;
}

function trimTrailingZero(value: number): string {
  return value % 1 === 0 ? value.toFixed(0) : value.toFixed(1);
}
```

- [ ] **Step 3: Create `src/lib/nav-items.ts`**

```ts
import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  Megaphone,
  Package,
  Store,
  TrendingUp,
  Users,
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string | null;
  expandable?: boolean;
}

export const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid, href: "/" },
  { id: "products", label: "Products", icon: Package, href: null },
  {
    id: "customers",
    label: "Customers",
    icon: Users,
    href: null,
    expandable: true,
  },
  { id: "shop", label: "Shop", icon: Store, href: null },
  {
    id: "income",
    label: "Income",
    icon: TrendingUp,
    href: null,
    expandable: true,
  },
  { id: "promote", label: "Promote", icon: Megaphone, href: null },
];
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/lib/utils.ts src/lib/nav-items.ts
git commit -m "feat: add chart/icon deps, format utils, and sidebar nav config"
```

---

## Task 2: Shared UI primitives

**Files:**
- Create: `src/components/ui/Card.tsx`
- Create: `src/components/ui/Avatar.tsx`
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/IconButton.tsx`
- Create: `src/components/ui/Button.tsx`

**Interfaces:**
- Consumes: `cn` from `@/lib/utils` (Task 1)
- Produces: `Card({ children, className }: { children: ReactNode; className?: string })`
- Produces: `Avatar({ name, size, shape, className }: { name: string; size?: "sm" | "md" | "lg"; shape?: "circle" | "square"; className?: string })`
- Produces: `DeltaBadge({ direction, children }: { direction: "up" | "down"; children: ReactNode })`
- Produces: `StatusBadge({ status }: { status: "Active" | "Offline" })`
- Produces: `IconButton(props: ButtonHTMLAttributes<HTMLButtonElement> & { "aria-label": string })`
- Produces: `Button(props: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" })`

- [ ] **Step 1: Create `src/components/ui/Card.tsx`**

```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-black/5 bg-white p-5 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/ui/Avatar.tsx`**

```tsx
import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  shape?: "circle" | "square";
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

const COLORS = [
  "bg-azul-insecap-500 text-white",
  "bg-azul-insecap-400 text-white",
  "bg-azul-insecap-300 text-slate-900",
  "bg-slate-700 text-white",
  "bg-slate-400 text-white",
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

function getColorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash + name.charCodeAt(i)) % COLORS.length;
  }
  return COLORS[hash];
}

export function Avatar({
  name,
  size = "md",
  shape = "circle",
  className,
}: AvatarProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center font-medium",
        shape === "circle" ? "rounded-full" : "rounded-xl",
        SIZE_CLASSES[size],
        getColorForName(name),
        className
      )}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/ui/Badge.tsx`**

```tsx
import type { ReactNode } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeltaBadgeProps {
  direction: "up" | "down";
  children: ReactNode;
}

export function DeltaBadge({ direction, children }: DeltaBadgeProps) {
  const isUp = direction === "up";
  const Icon = isUp ? ArrowUp : ArrowDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        isUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
      )}
    >
      <Icon className="h-3 w-3" />
      {children}
    </span>
  );
}

interface StatusBadgeProps {
  status: "Active" | "Offline";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isActive = status === "Active";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
      )}
    >
      {status}
    </span>
  );
}
```

- [ ] **Step 4: Create `src/components/ui/IconButton.tsx`**

```tsx
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label": string;
}

export function IconButton({ className, children, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border border-black/5 bg-white text-slate-600 transition-colors hover:bg-slate-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 5: Create `src/components/ui/Button.tsx`**

```tsx
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
        variant === "primary"
          ? "bg-azul-insecap-500 text-white hover:bg-azul-insecap-500/90"
          : "border border-black/10 bg-white text-slate-700 hover:bg-slate-50",
        className
      )}
      {...props}
    />
  );
}
```

- [ ] **Step 6: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/ui
git commit -m "feat: add shared UI primitives (Card, Avatar, Badge, IconButton, Button)"
```

---

## Task 3: Dashboard types and mock data

**Files:**
- Create: `src/features/dashboard/types.ts`
- Create: `src/features/dashboard/data/mock.ts`

**Interfaces:**
- Produces: `interface OverviewStat { label: string; value: number; deltaPercent: number; direction: "up" | "down" }`
- Produces: `interface CustomerAvatar { name: string }`
- Produces: `interface ChartPoint { label: string; value: number }`
- Produces: `interface Product { id: string; name: string; price: number; status: "Active" | "Offline" }`
- Produces: `interface Comment { id: string; author: string; product: string; timestamp: string; text: string }`
- Produces: `overviewStats: { customers: OverviewStat; balance: OverviewStat }`
- Produces: `newCustomersToday: number`
- Produces: `recentCustomerAvatars: CustomerAvatar[]`
- Produces: `productViewSeries: ChartPoint[]`
- Produces: `productViewTotal: number`
- Produces: `productViewHighlightIndex: number`
- Produces: `popularProducts: Product[]`
- Produces: `comments: Comment[]`

- [ ] **Step 1: Create `src/features/dashboard/types.ts`**

```ts
export interface OverviewStat {
  label: string;
  value: number;
  deltaPercent: number;
  direction: "up" | "down";
}

export interface CustomerAvatar {
  name: string;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  status: "Active" | "Offline";
}

export interface Comment {
  id: string;
  author: string;
  product: string;
  timestamp: string;
  text: string;
}
```

- [ ] **Step 2: Create `src/features/dashboard/data/mock.ts`**

```ts
import type {
  ChartPoint,
  Comment,
  CustomerAvatar,
  OverviewStat,
  Product,
} from "@/features/dashboard/types";

export const overviewStats: { customers: OverviewStat; balance: OverviewStat } = {
  customers: {
    label: "Customers",
    value: 1293,
    deltaPercent: 36.8,
    direction: "up",
  },
  balance: {
    label: "Balance",
    value: 256000,
    deltaPercent: 36.8,
    direction: "up",
  },
};

export const newCustomersToday = 857;

export const recentCustomerAvatars: CustomerAvatar[] = [
  { name: "Gladyce Rodriguez" },
  { name: "Elbert Chen" },
  { name: "Dash Patel" },
  { name: "Joyce Kim" },
  { name: "Marina Silva" },
];

export const productViewSeries: ChartPoint[] = [
  { label: "Mon", value: 6.1 },
  { label: "Tue", value: 7.4 },
  { label: "Wed", value: 5.8 },
  { label: "Thu", value: 2.2 },
  { label: "Fri", value: 8.9 },
  { label: "Sat", value: 6.7 },
  { label: "Sun", value: 5.3 },
];

export const productViewTotal = 10_200_000;
export const productViewHighlightIndex = 3;

export const popularProducts: Product[] = [
  { id: "1", name: "Crypter - NFT UI Kit", price: 3250, status: "Active" },
  { id: "2", name: "Bento Pro 2.0 Illustrations", price: 7890, status: "Active" },
  { id: "3", name: "Fleet - travel shopping kit", price: 1500, status: "Offline" },
  { id: "4", name: "SimpleSocial UI Design Kit", price: 9999.99, status: "Active" },
  { id: "5", name: "Bento Pro vol. 2", price: 4750, status: "Active" },
];

export const comments: Comment[] = [
  {
    id: "1",
    author: "Joyce",
    product: "Bento Pro 2.0",
    timestamp: "09:00 AM",
    text: "Great work! When HTML version will be available?",
  },
  {
    id: "2",
    author: "Gladyce",
    product: "Food Delivery App",
    timestamp: "08:14 AM",
    text: "Love the color palette on this one, super clean.",
  },
];
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/features/dashboard/types.ts src/features/dashboard/data/mock.ts
git commit -m "feat: add dashboard types and local mock data"
```

---

## Task 4: Sidebar

**Files:**
- Create: `src/components/layout/Sidebar.tsx`
- Modify: `src/app/page.tsx` (temporary: render only `<Sidebar />` to visually verify)

**Interfaces:**
- Consumes: `navItems` from `@/lib/nav-items` (Task 1), `cn` from `@/lib/utils` (Task 1)
- Produces: `Sidebar()` — no props.

- [ ] **Step 1: Create `src/components/layout/Sidebar.tsx`**

```tsx
import Link from "next/link";
import { Compass, MessageCircle } from "lucide-react";
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
      <button
        type="button"
        aria-label="Chat"
        className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-slate-50"
      >
        <MessageCircle className="h-5 w-5" />
      </button>
    </aside>
  );
}
```

- [ ] **Step 2: Temporarily mount it in `src/app/page.tsx`**

Replace the entire file contents with:

```tsx
import { Sidebar } from "@/components/layout/Sidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
    </div>
  );
}
```

- [ ] **Step 3: Verify visually**

Run: `npm run dev` (skip if already running) and open `http://localhost:3000`.
Expected: a narrow white column on the left with a dark rounded logo square at
the top, 6 icon buttons below it (first one — Dashboard — tinted in
azul-insecap blue), and a chat bubble icon pinned to the bottom.

Run: `npx tsc --noEmit` and `npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Sidebar.tsx src/app/page.tsx
git commit -m "feat: add dashboard sidebar"
```

---

## Task 5: Header

**Files:**
- Create: `src/components/layout/Header.tsx`
- Modify: `src/app/page.tsx` (temporary: render `Sidebar` + `Header` side by side to visually verify)

**Interfaces:**
- Consumes: `Avatar` from `@/components/ui/Avatar`, `Button` from `@/components/ui/Button`, `IconButton` from `@/components/ui/IconButton` (Task 2)
- Produces: `Header()` — no props.

- [ ] **Step 1: Create `src/components/layout/Header.tsx`**

```tsx
import { Bell, MessageCircle, Search } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";

export function Header() {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-black/5 bg-white px-6 py-4">
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
      <div className="flex flex-1 items-center justify-end gap-3">
        <div className="flex w-full max-w-xs items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm text-slate-400">
          <Search className="h-4 w-4" />
          <span>Search anything...</span>
        </div>
        <Button>Create</Button>
        <IconButton aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </IconButton>
        <IconButton aria-label="Chat">
          <MessageCircle className="h-4 w-4" />
        </IconButton>
        <Avatar name="David Alvarez" size="md" />
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Temporarily mount it in `src/app/page.tsx`**

Replace the entire file contents with:

```tsx
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify visually**

Run: `npm run dev` (skip if already running) and open `http://localhost:3000`.
Expected: sidebar on the left; to its right, a header row with "Dashboard"
title, a search pill, a blue "Create" button, bell and chat icon buttons, and
a user avatar circle on the far right.

Run: `npx tsc --noEmit` and `npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Header.tsx src/app/page.tsx
git commit -m "feat: add dashboard header"
```

---

## Task 6: DashboardShell

**Files:**
- Create: `src/components/layout/DashboardShell.tsx`
- Modify: `src/app/page.tsx` (use the shell with placeholder content)

**Interfaces:**
- Consumes: `Sidebar` (Task 4), `Header` (Task 5)
- Produces: `DashboardShell({ children }: { children: ReactNode })`

- [ ] **Step 1: Create `src/components/layout/DashboardShell.tsx`**

```tsx
import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 bg-background px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update `src/app/page.tsx` to use the shell**

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

- [ ] **Step 3: Verify visually**

Run: `npm run dev` (skip if already running) and open `http://localhost:3000`.
Expected: same sidebar + header as before, now with a light-gray content area
below the header showing the placeholder text.

Run: `npx tsc --noEmit` and `npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/DashboardShell.tsx src/app/page.tsx
git commit -m "feat: compose dashboard shell (sidebar + header + content slot)"
```

---

## Task 7: Overview card (stats + new customers banner)

**Files:**
- Create: `src/features/dashboard/components/StatBlock.tsx`
- Create: `src/features/dashboard/components/NewCustomersBanner.tsx`
- Create: `src/features/dashboard/components/OverviewCard.tsx`
- Modify: `src/app/page.tsx` (render `<OverviewCard />` inside the shell)

**Interfaces:**
- Consumes: `Card` (Task 2), `DeltaBadge` (Task 2), `Avatar` (Task 2), `formatNumber`/`formatCompactNumber` (Task 1), `OverviewStat`/`CustomerAvatar` types (Task 3), `overviewStats`/`newCustomersToday`/`recentCustomerAvatars` mock data (Task 3)
- Produces: `StatBlock({ stat, icon, compact }: { stat: OverviewStat; icon: LucideIcon; compact?: boolean })`
- Produces: `NewCustomersBanner({ count, avatars }: { count: number; avatars: CustomerAvatar[] })`
- Produces: `OverviewCard()` — no props.

- [ ] **Step 1: Create `src/features/dashboard/components/StatBlock.tsx`**

```tsx
import type { LucideIcon } from "lucide-react";
import { DeltaBadge } from "@/components/ui/Badge";
import { formatCompactNumber, formatNumber } from "@/lib/utils";
import type { OverviewStat } from "@/features/dashboard/types";

interface StatBlockProps {
  stat: OverviewStat;
  icon: LucideIcon;
  compact?: boolean;
}

export function StatBlock({ stat, icon: Icon, compact }: StatBlockProps) {
  const displayValue = compact
    ? formatCompactNumber(stat.value)
    : formatNumber(stat.value);

  return (
    <div className="flex flex-1 flex-col gap-3">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Icon className="h-4 w-4" />
        {stat.label}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-3xl font-semibold text-slate-900">
          {displayValue}
        </span>
        <DeltaBadge direction={stat.direction}>{stat.deltaPercent}%</DeltaBadge>
      </div>
      <span className="text-xs text-slate-400">vs last month</span>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/features/dashboard/components/NewCustomersBanner.tsx`**

```tsx
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
```

- [ ] **Step 3: Create `src/features/dashboard/components/OverviewCard.tsx`**

```tsx
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
```

- [ ] **Step 4: Update `src/app/page.tsx`**

Replace the entire file contents with:

```tsx
import { DashboardShell } from "@/components/layout/DashboardShell";
import { OverviewCard } from "@/features/dashboard/components/OverviewCard";

export default function Home() {
  return (
    <DashboardShell>
      <OverviewCard />
    </DashboardShell>
  );
}
```

- [ ] **Step 5: Verify visually**

Run: `npm run dev` (skip if already running) and open `http://localhost:3000`.
Expected: an "Overview" card with a "Last month" pill button, two stat blocks
(Customers "1,293" and Balance "256k", both with a green "36.8%" badge), and
below them the "857 new customers today!" banner with 5 named avatar circles
and a circular arrow button.

Run: `npx tsc --noEmit` and `npm run lint`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/features/dashboard/components/StatBlock.tsx \
  src/features/dashboard/components/NewCustomersBanner.tsx \
  src/features/dashboard/components/OverviewCard.tsx \
  src/app/page.tsx
git commit -m "feat: add dashboard overview card with stats and new customers banner"
```

---

## Task 8: Product view chart

**Files:**
- Create: `src/features/dashboard/components/ProductViewChart.tsx`
- Modify: `src/app/page.tsx` (render `<ProductViewChart />` below `<OverviewCard />`)

**Interfaces:**
- Consumes: `Card` (Task 2), `formatCompactNumber` (Task 1), `productViewSeries`/`productViewTotal`/`productViewHighlightIndex` mock data (Task 3)
- Produces: `ProductViewChart()` — no props. Client Component (`"use client"`).

- [ ] **Step 1: Create `src/features/dashboard/components/ProductViewChart.tsx`**

```tsx
"use client";

import { ChevronDown } from "lucide-react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Card } from "@/components/ui/Card";
import { formatCompactNumber } from "@/lib/utils";
import {
  productViewHighlightIndex,
  productViewSeries,
  productViewTotal,
} from "@/features/dashboard/data/mock";

const HIGHLIGHT_COLOR = "#369fdb";
const BASE_COLOR = "#e2e8f0";

export function ProductViewChart() {
  return (
    <Card className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Product view</h2>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-slate-600"
        >
          Last 7 days
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={productViewSeries} barCategoryGap="30%">
            <XAxis dataKey="label" axisLine={false} tickLine={false} hide />
            <Tooltip
              cursor={false}
              formatter={(value: number) => [`${value}m`, "Views"]}
            />
            <Bar dataKey="value" radius={[8, 8, 8, 8]}>
              {productViewSeries.map((point, index) => (
                <Cell
                  key={point.label}
                  fill={index === productViewHighlightIndex ? HIGHLIGHT_COLOR : BASE_COLOR}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <span className="text-3xl font-semibold text-slate-900">
        ${formatCompactNumber(productViewTotal)}
      </span>
    </Card>
  );
}
```

- [ ] **Step 2: Update `src/app/page.tsx`**

Replace the entire file contents with:

```tsx
import { DashboardShell } from "@/components/layout/DashboardShell";
import { OverviewCard } from "@/features/dashboard/components/OverviewCard";
import { ProductViewChart } from "@/features/dashboard/components/ProductViewChart";

export default function Home() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <OverviewCard />
        <ProductViewChart />
      </div>
    </DashboardShell>
  );
}
```

- [ ] **Step 3: Verify visually**

Run: `npm run dev` (skip if already running) and open `http://localhost:3000`.
Expected: below the overview card, a "Product view" card with a "Last 7 days"
pill, a 7-bar bar chart (one bar — Thursday — highlighted in azul-insecap
blue, the rest light gray), and a large "$10.2m" value underneath. Hovering
a bar shows a tooltip with its value in "Xm" format.

Run: `npx tsc --noEmit` and `npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/features/dashboard/components/ProductViewChart.tsx src/app/page.tsx
git commit -m "feat: add product view bar chart"
```

---

## Task 9: Popular products card

**Files:**
- Create: `src/features/dashboard/components/PopularProductsCard.tsx`
- Modify: `src/app/page.tsx` (add a right column with `<PopularProductsCard />`)

**Interfaces:**
- Consumes: `Card`/`Avatar`/`StatusBadge` (Task 2), `formatCurrency` (Task 1), `popularProducts` mock data (Task 3)
- Produces: `PopularProductsCard()` — no props.

- [ ] **Step 1: Create `src/features/dashboard/components/PopularProductsCard.tsx`**

```tsx
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
```

- [ ] **Step 2: Update `src/app/page.tsx`**

Replace the entire file contents with:

```tsx
import { DashboardShell } from "@/components/layout/DashboardShell";
import { OverviewCard } from "@/features/dashboard/components/OverviewCard";
import { PopularProductsCard } from "@/features/dashboard/components/PopularProductsCard";
import { ProductViewChart } from "@/features/dashboard/components/ProductViewChart";

export default function Home() {
  return (
    <DashboardShell>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          <OverviewCard />
          <ProductViewChart />
        </div>
        <div className="flex flex-col gap-6">
          <PopularProductsCard />
        </div>
      </div>
    </DashboardShell>
  );
}
```

- [ ] **Step 3: Verify visually**

Run: `npm run dev` (skip if already running) and open `http://localhost:3000`.
Expected: a right column appears next to the overview/chart column, showing
"Popular products" with 5 rows (colored square initials, name, price,
Active/Offline badge) and an "All products" button. Resize the window below
`lg` to confirm the right column stacks below the left one.

Run: `npx tsc --noEmit` and `npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/features/dashboard/components/PopularProductsCard.tsx src/app/page.tsx
git commit -m "feat: add popular products card and two-column dashboard grid"
```

---

## Task 10: Comments card and final page wiring

**Files:**
- Create: `src/features/dashboard/components/CommentsCard.tsx`
- Modify: `src/app/page.tsx` (add `<CommentsCard />` under `<PopularProductsCard />`)
- Modify: `src/app/layout.tsx:15-18` (update `metadata` title/description)

**Interfaces:**
- Consumes: `Card`/`Avatar` (Task 2), `comments` mock data (Task 3)
- Produces: `CommentsCard()` — no props.

- [ ] **Step 1: Create `src/features/dashboard/components/CommentsCard.tsx`**

```tsx
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { comments } from "@/features/dashboard/data/mock";

export function CommentsCard() {
  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-base font-semibold text-slate-900">Comments</h2>
      <ul className="flex flex-col gap-4">
        {comments.map((comment) => (
          <li key={comment.id} className="flex gap-3">
            <Avatar name={comment.author} size="sm" />
            <div className="flex flex-col gap-0.5">
              <p className="text-sm text-slate-900">
                <span className="font-medium">{comment.author}</span> on{" "}
                <span className="font-medium">{comment.product}</span>
              </p>
              <span className="text-xs text-slate-400">{comment.timestamp}</span>
              <p className="text-sm text-slate-600">{comment.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
```

- [ ] **Step 2: Update `src/app/page.tsx`**

Replace the entire file contents with:

```tsx
import { DashboardShell } from "@/components/layout/DashboardShell";
import { CommentsCard } from "@/features/dashboard/components/CommentsCard";
import { OverviewCard } from "@/features/dashboard/components/OverviewCard";
import { PopularProductsCard } from "@/features/dashboard/components/PopularProductsCard";
import { ProductViewChart } from "@/features/dashboard/components/ProductViewChart";

export default function Home() {
  return (
    <DashboardShell>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          <OverviewCard />
          <ProductViewChart />
        </div>
        <div className="flex flex-col gap-6">
          <PopularProductsCard />
          <CommentsCard />
        </div>
      </div>
    </DashboardShell>
  );
}
```

- [ ] **Step 3: Update metadata in `src/app/layout.tsx`**

In `src/app/layout.tsx`, replace:

```tsx
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};
```

with:

```tsx
export const metadata: Metadata = {
  title: "Dashboard",
  description: "Hackadisc dashboard",
};
```

- [ ] **Step 4: Verify visually**

Run: `npm run dev` (skip if already running) and open `http://localhost:3000`.
Expected: full dashboard layout matching the reference mockup's structure —
sidebar, header, overview + chart on the left, popular products + comments on
the right. Browser tab title reads "Dashboard".

Run: `npx tsc --noEmit` and `npm run lint`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/features/dashboard/components/CommentsCard.tsx src/app/page.tsx src/app/layout.tsx
git commit -m "feat: add comments card and finalize dashboard page layout"
```

---

## Task 11: Final QA pass

**Files:** none (verification only; fix forward in the same files listed in Tasks 1-10 if issues are found)

- [ ] **Step 1: Full production build**

Run: `npm run build`
Expected: build succeeds with no type or lint errors.

- [ ] **Step 2: Responsive check**

Run: `npm run dev` (skip if already running), open `http://localhost:3000`,
and use browser devtools to check at widths ~1440px (desktop), ~1024px
(the `lg` breakpoint), and ~768px (tablet).
Expected: at ≥1024px the two-column grid (content + 360px right rail) is
visible; below that, the right column stacks under the left column. The
sidebar stays fixed-width and visible at all these widths (mobile drawer is
out of scope per the spec).

- [ ] **Step 3: Compare against the reference mockup**

Open the dashboard next to the reference mockup image and confirm: sidebar
icon order (Dashboard, Products, Customers, Shop, Income, Promote) with
Dashboard highlighted in azul-insecap blue; header search/Create/bell/chat/
avatar order; Overview card with Customers/Balance stats and new-customers
banner; Product view chart with one highlighted bar and "$10.2m" total;
Popular products list with 5 items and status badges; Comments list with 2
entries. Note any visible discrepancy and fix it in the relevant component
file from Tasks 4-10.

- [ ] **Step 4: Remove unused scaffold assets (if any)**

Check whether `public/next.svg`, `public/vercel.svg`, `public/file.svg`,
`public/globe.svg`, `public/window.svg` are still referenced anywhere:

Run: `grep -r "next.svg\|vercel.svg\|file.svg\|globe.svg\|window.svg" src/`
Expected: no matches (the rebuilt `page.tsx` from Task 10 no longer uses
`next/image` with these files). If there are no matches, remove the unused
files.

```bash
git rm public/next.svg public/vercel.svg public/file.svg public/globe.svg public/window.svg
```

- [ ] **Step 5: Commit (only if Step 4 removed files)**

```bash
git commit -m "chore: remove unused create-next-app scaffold assets"
```
