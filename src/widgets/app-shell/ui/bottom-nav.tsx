"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookIcon, CalendarIcon, GearIcon } from "@/shared/ui";

const items = [
  { href: "/", label: "Рецепты", icon: BookIcon },
  { href: "/calendar", label: "Календарь", icon: CalendarIcon },
  { href: "/settings", label: "Настройки", icon: GearIcon },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-ink/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-2xl items-stretch justify-around px-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center justify-center gap-1 text-xs transition-colors ${
                active ? "text-terracotta" : "text-ink/55 hover:text-ink"
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
