"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "@/hooks/use-notifications";
import { NotificationList } from "./NotificationList";
import { Button } from "@/components/ui/button";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, markAsRead } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const mappedNotifications = notifications.map(n => ({
    id: n.id,
    message: n.body,
    link: n.action_url,
    read: n.is_read
  }));

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border bg-card shadow-xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-4 border-b bg-muted/30">
                <h3 className="font-bold text-sm">Notifications</h3>
            </div>
            <NotificationList
              notifications={mappedNotifications}
              onRead={(id) => markAsRead(id)}
            />
          </div>
        </>
      )}
    </div>
  );
}
