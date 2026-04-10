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
    { href: "/interactions", label: "Interactions", icon: Handshake },
  ];

  if (profile?.is_admin) {
    navItems.push({ href: "/admin", label: "Admin", icon: Shield });
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col bg-black px-5 py-8 md:flex">
      {/* Brand */}
      <div className="mb-12 flex h-16 items-center px-3">
        <Link href="/" className="flex items-center gap-3 font-black text-xl tracking-tight text-foreground">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-foreground text-background shadow-lg shadow-white/20">
            U
          </div>
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
                "group relative flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold tracking-tight transition-all",
                isActive
                  ? "bg-neutral-900 text-foreground"
                  : "text-muted-foreground hover:bg-neutral-900/70 hover:text-foreground"
              )}
            >
              <span
                className={cn(
                  "absolute left-0 top-1/2 h-0 w-0 -translate-y-1/2 rounded-r-full bg-primary transition-all",
                  isActive && "top-2 h-[calc(100%-1rem)] w-1 translate-y-0"
                )}
              />
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={cn(
                "transition-transform group-hover:scale-110",
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
          <Link href="/profile" className="flex items-center gap-3 rounded-2xl bg-neutral-900/70 px-4 py-3 transition-colors hover:bg-neutral-900 group">
            <Avatar className="size-9">
              <AvatarImage src={profile.avatar_url || ""} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                {profile.username?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-bold tracking-tight">{profile.username}</p>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                {profile.trust_score} trust
              </p>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold text-muted-foreground transition-all hover:bg-neutral-900 hover:text-destructive"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      )}
    </aside>
  );
}
