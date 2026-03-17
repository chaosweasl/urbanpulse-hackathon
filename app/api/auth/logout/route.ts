import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api-helpers";

// POST /api/auth/logout
export async function POST() {
  try {
    const supabase = await createClient();

    // Sign out with Supabase Auth
    const { error } = await supabase.auth.signOut();

    if (error) {
      return errorResponse(error.message, error.status || 500);
    }

    // Supabase client automatically handles clearing session cookies via the ssr package
    return successResponse({ message: "Logged out successfully" }, 200);
  } catch (err) {
    const error = err as Error;
    return errorResponse(error.message || "Internal server error", 500);
  }
}
