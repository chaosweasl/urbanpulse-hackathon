"use client";

import { useEffect } from "react";
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
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`realtime:${table}`)
      .on(
        "postgres_changes" as never,
        { event, schema: "public", table },
        (payload: { new: T }) => {
          callback(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, event, callback]);
}
