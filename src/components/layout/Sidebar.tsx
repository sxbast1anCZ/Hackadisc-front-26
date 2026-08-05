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
