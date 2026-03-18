import { createClient } from "@/utils/supabase/server";
import { errorResponse } from "@/lib/api-helpers";
import { Provider } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const provider = searchParams.get("provider") as Provider;

    if (!provider || !["github", "google"].includes(provider)) {
      return errorResponse("Invalid or missing provider", 400);
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/api/auth/callback`,
      },
    });

    if (error) {
      return errorResponse(error.message, 500);
    }

    if (data.url) {
      return NextResponse.redirect(data.url);
    }

    return errorResponse("Failed to initialize OAuth flow", 500);
  } catch (err) {
    const error = err as Error;
    return errorResponse(error.message || "Internal server error", 500);
  }
}
