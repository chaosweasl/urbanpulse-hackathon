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
    <aside className="hidden w-72 flex-col border-r border-border/50 bg-sidebar px-4 py-8 md:flex glass">
      {/* Brand */}
      <div className="mb-12 flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-3 font-black text-xl tracking-tight">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
            U
          </div>
          UrbanPulse
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-2 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-bold tracking-tight transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={cn(
                "transition-transform group-hover:scale-110",
                isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
              )} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Profile Snippet */}
      {user && profile && (
        <div className="mt-auto space-y-3 px-2 pb-6">
          <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors group">
            <Avatar className="size-9 border border-border/50">
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
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      )}
    </aside>
  );
}
