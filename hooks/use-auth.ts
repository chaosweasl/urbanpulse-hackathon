"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Profile } from "@/types";

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
}

/**
 * Hook to get the current authenticated user and their profile.
 */
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  });

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    const safeSetState = (nextState: AuthState) => {
      if (!mounted) return;
      setState(nextState);
    };

    const isLockError = (error: unknown) => {
      if (!error || typeof error !== "object") return false;

      const err = error as { message?: unknown; name?: unknown };
      const message = typeof err.message === "string" ? err.message.toLowerCase() : "";
      const name = typeof err.name === "string" ? err.name.toLowerCase() : "";

      return (
        name.includes("abort")
        || message.includes("lock")
        || message.includes("steal")
      );
    };

    const resolveUserWithProfile = async (user: User) => {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (!profile) {
          // If app data was deleted, force a clean signed-out state.
          try {
            await supabase.auth.signOut();
          } catch (signOutError) {
            console.warn("Auth sign-out after missing profile failed:", signOutError);
          }

          safeSetState({ user: null, profile: null, loading: false });
          return;
        }

        safeSetState({ user, profile, loading: false });
      } catch (error) {
        if (isLockError(error)) {
          console.warn("Auth profile resolution skipped due to transient lock contention.");
        } else {
          console.error("Failed to resolve auth profile:", error);
        }

        safeSetState({ user: null, profile: null, loading: false });
      }
    };

    const handleSessionUser = (user: User | null) => {
      if (user) {
        void resolveUserWithProfile(user);
      } else {
        safeSetState({ user: null, profile: null, loading: false });
      }
    };

    async function getSessionAndProfile() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        handleSessionUser(session?.user ?? null);
      } catch (error) {
        if (isLockError(error)) {
          console.warn("Auth session read skipped due to transient lock contention.");
        } else {
          console.error("Failed to read auth session:", error);
        }

        safeSetState({ user: null, profile: null, loading: false });
      }
    }

    void getSessionAndProfile();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSessionUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
