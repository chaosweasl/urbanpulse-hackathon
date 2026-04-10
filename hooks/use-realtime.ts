"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";

/**
 * Subscribe to Supabase Realtime changes on a table.
 *
 * @param table   - The Supabase table to listen on
 * @param event   - The event type: INSERT, UPDATE, DELETE, or *
 * @param callback - Function called with the new/updated row payload
 */
export function useRealtime<T extends object>(
  table: string,
  event: "INSERT" | "UPDATE" | "DELETE" | "*",
  callback: (payload: T) => void
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const supabase = createClient();
    const channelId = Math.random().toString(36).substring(7);

    const channel = supabase
      .channel(`realtime:${table}:${channelId}`)
      .on(
        "postgres_changes" as never,
        { event, schema: "public", table },
        (payload: { new: T }) => {
          callbackRef.current(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, event]);
}
