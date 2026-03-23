"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Notification {
  id: string;
  message: string;
  link?: string;
  read?: boolean;
}

interface NotificationListProps {
  notifications: Notification[];
  onRead?: (id: string) => void;
}

export function NotificationList({
  notifications,
  onRead,
}: NotificationListProps) {
  const [items, setItems] = useState(notifications);
  const router = useRouter();

  const handleClick = (notif: Notification) => {
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
    <div className="w-80 max-h-96 overflow-y-auto rounded-2xl shadow-lg border bg-card">
      {items.length === 0 && (
        <p className="p-4 text-sm text-muted-foreground">
          No notifications
        </p>
      )}

      {items.map((notif) => (
        <div
          key={notif.id}
          onClick={() => handleClick(notif)}
          className={cn(
            "p-3 cursor-pointer border-b last:border-none transition",
            "hover:bg-muted",
            !notif.read && "bg-blue-50/50 dark:bg-blue-900/20"
          )}
        >
          <p className="text-sm text-foreground">
            {notif.message}
          </p>

          {!notif.read && (
            <span className="text-xs text-blue-500 font-medium">
              New
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
