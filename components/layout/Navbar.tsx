"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { NotificationBell } from "@/components/notifications/NotificationBell";

export function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card/80 px-6 backdrop-blur-lg sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {/* Placeholder for future breadcrumbs or title */}
      </div>
      <div className="flex items-center gap-2">
        <NotificationBell />
        <Link href="/profile">
          <Button variant="ghost" size="icon">
            <User size={24} />
          </Button>
        </Link>
      </div>
    </header>
  );
}
