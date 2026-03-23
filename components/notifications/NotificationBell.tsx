"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "@/hooks/use-notifications";
import Notification from "./notification";
import { Button } from "@/components/ui/button";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, markAsRead } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.is_read).length;

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
          <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border bg-card p-4 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="mb-4 font-bold">Notifications</h3>
            <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No notifications yet.
                </p>
              ) : (
                notifications.map((notif) => (
                  <Notification
                    key={notif.id}
                    message={notif.body}
                    onClose={() => {
                      markAsRead(notif.id);
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
