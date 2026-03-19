// Layout: Navbar
// TODO: Implement top navigation bar with logo, search, notification bell, user avatar

import { NotificationBell } from "@/components/notifications/NotificationBell";
import { UserIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="flex h-16 items-center justify-between border-b px-6 bg-background/80 backdrop-blur-md">
      <span className="text-lg font-bold text-primary md:hidden">UrbanPulse</span>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <NotificationBell />
        <Link href="/profile">
          <Button variant="ghost" size="icon">
            <UserIcon size={24} />
          </Button>
        </Link>
      </div>
    </nav>
  );
}
