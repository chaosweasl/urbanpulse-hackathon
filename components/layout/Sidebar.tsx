"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Home,
  Rss,
  Map as MapIcon,
  Package,
  MessageSquare,
  Activity,
  User,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations("Navigation");
  const { user, profile } = useAuth();

  const navItems = [
    { href: "/", label: t("home"), icon: Home },
    { href: "/feed", label: t("feed"), icon: Rss },
    { href: "/map", label: t("map"), icon: MapIcon },
    { href: "/resources", label: t("resources"), icon: Package },
    { href: "/messages", label: t("messages"), icon: MessageSquare },
    { href: "/pets", label: t("pets"), icon: Activity },
  ];

  if (user) {
    navItems.push({ href: "/profile", label: t("profile"), icon: User });
  }

  if (profile?.is_admin) {
    navItems.push({ href: "/admin", label: "Admin", icon: Shield });
  }

  return (
    <aside className="hidden w-64 flex-col border-r bg-card md:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            U
          </div>
          UrbanPulse
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
