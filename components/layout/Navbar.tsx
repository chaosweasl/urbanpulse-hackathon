"use client";

import { NotificationBell } from "@/components/notifications/NotificationBell";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";
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
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex h-[calc(4rem+env(safe-area-inset-top))] items-end justify-between bg-[linear-gradient(180deg,rgba(0,0,0,0.84),rgba(0,0,0,0.45)_70%,transparent)] px-4 pb-2 backdrop-blur-2xl md:hidden">
      <span className="text-lg font-black tracking-tighter text-foreground">
        UrbanPulse
      </span>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
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
