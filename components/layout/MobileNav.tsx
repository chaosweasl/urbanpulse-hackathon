"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Map,
  Plus,
  MessageSquare,
  User,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function MobileNav() {
  const pathname = usePathname();
  const t = useTranslations("Navigation");

  const navItems = [
    { href: "/feed", icon: Activity, label: t("feed") },
    { href: "/map", icon: Map, label: t("map") },
    { href: "/feed?compose=true", icon: Plus, label: t("create") || "Add", isPrimary: true },
    { href: "/messages", icon: MessageSquare, label: t("messages") },
    { href: "/profile", icon: User, label: t("profile") || "Profile" },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 pb-[max(env(safe-area-inset-bottom),0.5rem)] md:hidden">
      <div className="mx-3 flex h-[4.4rem] items-center justify-around rounded-lg border-t border-white/8 bg-zinc-950 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href.startsWith("/feed?") ? pathname === "/feed" : pathname === item.href;

          if (item.isPrimary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -top-5 flex size-12 items-center justify-center rounded-full border border-primary/60 bg-primary text-primary-foreground transition-transform active:scale-90"
                aria-label={item.label}
              >
                <Icon size={22} strokeWidth={2.5} />
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={cn(
                "flex flex-col items-center gap-0.5 transition-colors active:scale-95",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <div className={cn(
                "relative flex size-10 items-center justify-center rounded-lg transition-all",
                isActive && "bg-white/10"
              )}>
                {isActive && <span className="absolute -top-1 h-1 w-5 rounded-full bg-primary" />}
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
