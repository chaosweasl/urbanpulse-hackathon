"use client";

import { useState, useEffect } from "react";
import { useRealtime } from "@/hooks/use-realtime";
import { Notification as NotificationType } from "@/types";
import { createClient } from "@/utils/supabase/client";

/**
 * Hook to manage notifications state and real-time updates.
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);


  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    async function initialFetch() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !mounted) return;

      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (data && mounted) setNotifications(data);
    }

    initialFetch();
    return () => { mounted = false; };
  }, []);

  useRealtime<NotificationType>("notifications", "INSERT", (newNotif) => {
    setNotifications((prev) => [newNotif, ...prev].slice(0, 10));
  });

  const markAsRead = async (id: string) => {
    const supabase = createClient();
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return { notifications, markAsRead, removeNotification };
}
