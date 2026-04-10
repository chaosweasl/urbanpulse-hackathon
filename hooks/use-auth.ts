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

    const resolveUserWithProfile = async (user: User) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!profile) {
        // If app data was deleted, force a clean signed-out state.
        await supabase.auth.signOut();
        setState({ user: null, profile: null, loading: false });
        return;
      }

      setState({ user, profile, loading: false });
    };

    async function getSessionAndProfile() {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        await resolveUserWithProfile(user);
      } else {
        setState({ user: null, profile: null, loading: false });
      }
    }

    getSessionAndProfile();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null;
      if (user) {
        await resolveUserWithProfile(user);
      } else {
        setState({ user: null, profile: null, loading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return state;
}
