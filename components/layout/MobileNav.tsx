"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Map,
  Plus,
  MessageSquare,
  User,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function MobileNav() {
  const pathname = usePathname();
  const t = useTranslations("Navigation");

  const navItems = [
    { href: "/feed", icon: Activity, label: t("feed") },
    { href: "/map", icon: Map, label: t("map") },
    { href: "/create", icon: Plus, label: t("create") || "Add", isPrimary: true },
    { href: "/messages", icon: MessageSquare, label: t("messages") },
    { href: "/profile", icon: User, label: t("profile") || "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="flex h-20 items-center justify-around border-t border-border/50 bg-background/80 px-4 pb-2 backdrop-blur-xl glass">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isPrimary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -top-6 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/40 transition-transform active:scale-90"
              >
                <Icon size={28} strokeWidth={2.5} />
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors active:scale-95",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div className={cn(
                "flex size-10 items-center justify-center rounded-xl transition-all",
                isActive && "bg-primary/10 shadow-lg shadow-primary/10"
              )}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
