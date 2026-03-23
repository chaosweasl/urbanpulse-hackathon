"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Rss,
  Map as MapIcon,
  Package,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/feed", label: "Feed", icon: Rss },
    { href: "/map", label: "Map", icon: MapIcon },
    { href: "/resources", label: "Resources", icon: Package },
    { href: "/messages", label: "Messages", icon: MessageSquare },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-card/80 px-4 backdrop-blur-lg md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon size={24} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
