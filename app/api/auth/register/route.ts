import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { registerSchema } from "@/lib/validators";
import { errorResponse, successResponse } from "@/lib/api-helpers";

// POST /api/auth/register
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return errorResponse(result.error.errors[0].message, 400);
    }

    const { email, password, username, full_name } = result.data;

    // Initialize Supabase client
    const supabase = await createClient();

    // Create user with Supabase Auth
    // The handle_new_user trigger will automatically create the profile row
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name,
        },
      },
    });

    if (error) {
      return errorResponse(error.message, error.status || 400);
    }

    return successResponse({
      user: data.user,
      session: data.session,
    }, 201);
  } catch (error: any) {
    return errorResponse(error.message || "Internal server error", 500);
  }
}
