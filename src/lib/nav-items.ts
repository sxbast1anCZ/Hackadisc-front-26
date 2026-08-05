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
