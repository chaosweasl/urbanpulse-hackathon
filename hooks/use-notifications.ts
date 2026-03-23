"use client";

import { useState, useEffect, useCallback } from "react";
import type { Notification } from "@/types";
import { useRealtime } from "./use-realtime";

/**
 * Hook to manage notification state with real-time updates.
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch initial notifications
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch("/api/notifications");
        const json = await res.json();
        if (json.success && json.data) {
          setNotifications(json.data);
          setUnreadCount(json.data.filter((n: Notification) => !n.is_read).length);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  // Listen for new notifications in real-time
  const handleNewNotification = useCallback((payload: Record<string, unknown>) => {
    const notification = payload as unknown as Notification;
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  }, []);

  useRealtime("notifications", "INSERT", handleNewNotification);

  // Mark notifications as read
  const markAsRead = useCallback(async (ids: string[]) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      setNotifications((prev) =>
        prev.map((n) => (ids.includes(n.id) ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - ids.length));
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  }, []);

  return { notifications, unreadCount, loading, markAsRead };
}
