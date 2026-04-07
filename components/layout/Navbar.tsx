"use client";

import { NotificationBell } from "@/components/notifications/NotificationBell";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="flex h-16 items-center justify-between border-b px-6 bg-background/80 backdrop-blur-md">
      <span className="text-lg font-bold text-primary md:hidden">
        UrbanPulse
      </span>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        {user ? (
          <>
            <NotificationBell />
            <Link href="/profile">
              <Button variant="ghost" size="icon" title="Profile">
                <User size={24} />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="Log Out"
            >
              <LogOut size={24} />
            </Button>
          </>
        ) : (
          <Link href="/login">
            <Button variant="default">Log In</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
