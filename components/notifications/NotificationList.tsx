"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface NotificationItem {
  id: string;
  message: string;
  link?: string | null;
  read?: boolean;
}

interface NotificationListProps {
  notifications: NotificationItem[];
  onRead?: (id: string) => void;
  className?: string;
}

export function NotificationList({
  notifications,
  onRead,
  className,
}: NotificationListProps) {
  const [items, setItems] = useState(notifications);
  const router = useRouter();

  // Sync state with props
  useEffect(() => {
    setItems(notifications);
  }, [notifications]);

  const handleClick = (notif: NotificationItem) => {
    setItems((prev) =>
      prev.map((n) =>
        n.id === notif.id ? { ...n, read: true } : n
      )
    );

    onRead?.(notif.id);

    if (notif.link) {
      router.push(notif.link);
    }
  };

  return (
    <div className={cn("w-full max-h-96 overflow-y-auto bg-card", className)}>
      {items.length === 0 && (
        <p className="p-8 text-center text-sm text-muted-foreground">
          No notifications yet.
        </p>
      )}

      {items.map((notif) => (
        <div
          key={notif.id}
          onClick={() => handleClick(notif)}
          className={cn(
            "p-4 cursor-pointer border-b last:border-none transition flex flex-col gap-1",
            "hover:bg-muted/50",
            !notif.read && "bg-blue-50/50 dark:bg-blue-900/10"
          )}
        >
          <p className={cn("text-sm text-foreground", !notif.read && "font-medium")}>
            {notif.message}
          </p>

          {!notif.read && (
            <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">
              New
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
