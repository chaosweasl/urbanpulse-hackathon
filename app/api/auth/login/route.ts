import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { loginSchema } from "@/lib/validators";
import { errorResponse, successResponse } from "@/lib/api-helpers";

// POST /api/auth/login
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return errorResponse(result.error.errors[0].message, 400);
    }

    const { email, password } = result.data;

    // Initialize Supabase client
    const supabase = await createClient();

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return errorResponse(error.message, error.status || 401);
    }

    // Supabase client automatically handles setting session cookies via the ssr package
    return successResponse({
      user: data.user,
      session: data.session,
    }, 200);
  } catch (error: any) {
    return errorResponse(error.message || "Internal server error", 500);
  }
}
