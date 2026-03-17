import { createClient } from "@/utils/supabase/server";
import { registerSchema } from "@/lib/validators";
import { errorResponse, successResponse } from "@/lib/api-helpers";
import { authRateLimiter } from "@/lib/rate-limit";

// POST /api/auth/register
export async function POST(request: Request) {
  try {
    // Rate limit by IP
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { allowed, remaining } = authRateLimiter.check(ip);
    if (!allowed) {
      return errorResponse("Too many requests. Please try again later.", 429);
    }

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
  } catch (err) {
    const error = err as Error;
    return errorResponse(error.message || "Internal server error", 500);
  }
}
