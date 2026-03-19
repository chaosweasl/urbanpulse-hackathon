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
  PlusSignIcon,
  Shield01Icon
} from "@hugeicons/react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export function MobileNav() {
  const pathname = usePathname();
  const t = useTranslations("Navigation");
  const { profile } = useAuth();

  const navItems = [
    { href: "/feed", label: t("feed"), icon: RssIcon },
    { href: "/map", label: t("map"), icon: Map01Icon },
    // Center Action Button could go here
    { href: "/messages", label: t("messages"), icon: Message01Icon },
    { href: "/pets", label: t("pets"), icon: AnimalIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-md md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon size={24} variant={isActive ? "solid" : "outline"} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}

        {profile?.is_admin && (
           <Link
           href="/dashboard"
           className={cn(
             "flex flex-col items-center justify-center gap-1 transition-colors",
             pathname.startsWith("/dashboard") ? "text-primary" : "text-muted-foreground"
           )}
         >
           <Shield01Icon size={24} variant={pathname.startsWith("/dashboard") ? "solid" : "outline"} />
           <span className="text-[10px] font-medium">{t("admin")}</span>
         </Link>
        )}

        <Link
          href="/profile"
          className={cn(
            "flex flex-col items-center justify-center gap-1 transition-colors",
            pathname === "/profile" ? "text-primary" : "text-muted-foreground"
          )}
        >
          <UserIcon size={24} variant={pathname === "/profile" ? "solid" : "outline"} />
          <span className="text-[10px] font-medium">{t("profile")}</span>
        </Link>
      </div>
    </nav>
  );
}
