"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Home,
  Activity,
  Map as MapIcon,
  Package,
  MessageSquare,
  User,
  Shield,
  CheckCircle,
  Trophy,
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
    { href: "/", label: t("home"), icon: Home },
    { href: "/feed", label: t("feed"), icon: Activity },
    { href: "/map", label: t("map"), icon: MapIcon },
    { href: "/resources", label: t("resources"), icon: Package },
    { href: "/messages", label: t("messages"), icon: MessageSquare },
  ];

  if (profile?.is_admin) {
    navItems.push({ href: "/admin", label: "Admin", icon: Shield });
  }

  return (
    <aside className="hidden w-72 flex-col border-r border-border/50 bg-sidebar px-4 py-8 md:flex glass">
      {/* Brand */}
      <div className="mb-12 flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-3 font-black text-2xl tracking-tighter">
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
                "group flex items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-bold tracking-tight transition-all",
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
        <div className="mt-auto space-y-4 px-2 pb-6">
          <div className="rounded-3xl bg-muted/30 p-5 backdrop-blur-md border border-border/50">
            <div className="mb-4 flex items-center gap-4">
              <Avatar className="size-12 border-2 border-primary/20 p-0.5">
                <AvatarImage src={profile.avatar_url || ""} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {profile.username?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-1">
                  <p className="truncate text-sm font-black tracking-tight">{profile.username}</p>
                  {profile.is_verified_neighbor && (
                    <CheckCircle className="size-3 text-primary fill-primary/20" />
                  )}
                </div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Neighbor</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 border-t border-border/50 pt-4">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Trust Score</span>
                <div className="flex items-center gap-1 text-primary">
                   <Trophy className="size-3" />
                   <span className="text-sm font-black">{profile.trust_score || 0}</span>
                </div>
              </div>
              <Link href="/profile" className="flex items-center justify-center rounded-xl bg-primary/10 p-1 text-xs font-bold text-primary transition-colors hover:bg-primary/20">
                View
              </Link>
            </div>
            
            <button
              onClick={handleLogout}
              className="mt-3 w-full flex items-center justify-center gap-2 px-2 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
