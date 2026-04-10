"use client";

import { NotificationBell } from "@/components/notifications/NotificationBell";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export function Navbar() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<import("@supabase/supabase-js").User | null>(null);
  const t = useTranslations("Navigation");

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="flex h-16 items-center justify-between border-b border-border/50 px-6 bg-background/80 backdrop-blur-md md:hidden">
      <span className="text-lg font-black tracking-tighter text-foreground">
        UrbanPulse
      </span>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
        {user ? (
          <>
            <NotificationBell />
            <Link href="/profile">
              <Button variant="ghost" size="icon" title={t("profile")}>
                <User size={24} />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title={t("logout")}
            >
              <LogOut size={24} />
            </Button>
          </>
        ) : (
          <Link href="/login">
            <Button variant="default">{t("login")}</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
