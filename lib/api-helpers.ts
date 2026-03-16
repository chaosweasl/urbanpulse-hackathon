import { NextResponse } from "next/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { PAGINATION } from "./constants";

export async function requireAuth(supabase: SupabaseClient) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireAdmin(supabase: SupabaseClient) {
  const user = await requireAuth(supabase);
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (error || !profile?.is_admin) {
    throw new Error("Forbidden");
  }
  return user;
}

export function parsePagination(searchParams: URLSearchParams) {
  const page = parseInt(searchParams.get("page") || "", 10) || PAGINATION.DEFAULT_PAGE;
  let perPage = parseInt(searchParams.get("per_page") || "", 10) || PAGINATION.DEFAULT_PER_PAGE;
  if (perPage > PAGINATION.MAX_PER_PAGE) {
    perPage = PAGINATION.MAX_PER_PAGE;
  }
  return { page, perPage };
}

export function errorResponse(message: string, status: number = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function successResponse(data: any, status: number = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function paginatedResponse(data: any[], total: number, page: number, perPage: number) {
  return successResponse({
    items: data,
    metadata: {
      total,
      page,
      per_page: perPage,
      total_pages: Math.ceil(total / perPage),
    },
  });
}
