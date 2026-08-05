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
