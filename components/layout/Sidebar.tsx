"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Home01Icon,
  RssIcon,
  Map01Icon,
  PackageIcon,
  Message01Icon,
  AnimalIcon,
  UserIcon,
  Shield01Icon
} from "@hugeicons/react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations("Navigation");
  const { profile } = useAuth();

  const navItems = [
    { href: "/", label: t("home"), icon: Home01Icon },
    { href: "/feed", label: t("feed"), icon: RssIcon },
    { href: "/map", label: t("map"), icon: Map01Icon },
    { href: "/resources", label: t("resources"), icon: PackageIcon },
    { href: "/messages", label: t("messages"), icon: Message01Icon },
    { href: "/pets", label: t("pets"), icon: AnimalIcon },
    { href: "/profile", label: t("profile"), icon: UserIcon },
  ];

  return (
    <aside className="hidden w-64 flex-col border-r bg-card md:flex">
      <div className="flex h-16 items-center border-b px-6">
        <span className="text-xl font-bold text-primary">UrbanPulse</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon size={20} variant={isActive ? "solid" : "outline"} />
              {item.label}
            </Link>
          );
        })}

        {profile?.is_admin && (
           <Link
           href="/dashboard"
           className={cn(
             "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
             pathname.startsWith("/dashboard")
               ? "bg-primary text-primary-foreground shadow-sm"
               : "text-muted-foreground hover:bg-muted hover:text-foreground"
           )}
         >
           <Shield01Icon size={20} variant={pathname.startsWith("/dashboard") ? "solid" : "outline"} />
           {t("admin")}
         </Link>
        )}
      </nav>
    </aside>
  );
}
