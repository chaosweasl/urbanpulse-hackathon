"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Activity,
  Map as MapIcon,
  Package,
  MessageSquare,
  User,
  Shield,
  Handshake,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Navigation");
  const { user, profile } = useAuth();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const navItems = [
    { href: "/feed", label: t("feed"), icon: Activity },
    { href: "/map", label: t("map"), icon: MapIcon },
    { href: "/resources", label: t("resources"), icon: Package },
    { href: "/messages", label: t("messages"), icon: MessageSquare },
    { href: "/interactions", label: t("interactions"), icon: Handshake },
  ];

  if (profile?.is_admin) {
    navItems.push({ href: "/admin", label: t("admin"), icon: Shield });
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col bg-background px-5 py-8 md:flex">
      {/* Brand */}
      <div className="mb-12 flex h-16 items-center px-3">
        <Link href="/" className="text-xl font-bold tracking-tight text-foreground">
          UrbanPulse
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1.5 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-bold tracking-tight transition-colors",
                isActive
                  ? "bg-white/10 text-foreground"
                  : "text-zinc-400 hover:bg-white/5 hover:text-foreground"
              )}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={cn(
                "transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
              )} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Profile Snippet */}
      {user && profile && (
        <div className="mt-auto space-y-3 px-2 pb-4">
          <div className="flex items-center justify-between px-2">
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              {t("language")}
            </p>
            <LanguageSwitcher className="w-20" />
          </div>

          <Link href="/profile" className="group flex items-center gap-3 rounded-lg border border-white/8 bg-zinc-900 px-4 py-3 transition-colors hover:bg-zinc-800">
            <Avatar className="size-9">
              <AvatarImage src={profile.avatar_url || ""} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                {profile.username?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-bold tracking-tight">{profile.username}</p>
              <p className="text-xs uppercase tracking-widest text-zinc-500">
                {profile.trust_score} trust
              </p>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 text-sm font-bold text-muted-foreground transition-colors hover:bg-zinc-800 hover:text-destructive"
          >
            <LogOut size={16} />
            {t("logout")}
          </button>
        </div>
      )}
    </aside>
  );
}
