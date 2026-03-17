import { createClient } from "@/utils/supabase/server";
import {
  requireAuth,
  parsePagination,
  errorResponse,
  successResponse,
  paginatedResponse,
} from "@/lib/api-helpers";
import { createPetReportSchema } from "@/lib/validators";

// GET /api/pets — List pet reports
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, perPage } = parsePagination(searchParams);
    const type = searchParams.get("type");
    const species = searchParams.get("species");
    const status = searchParams.get("status") || "active";
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    const supabase = await createClient();

    let query;

    if (lat && lng) {
      // Use PostGIS function via RPC if available (or similar fallback logic as pulses)
      // Assuming a generic `nearby_pets` function doesn't exist yet, we'll try to query directly
      // with standard filters and handle geo filtering later, or rely on a fallback.
      // For now, we'll do standard query
      query = supabase.from("pets").select(
        `
        *,
        reporter:profiles(id, username, full_name, avatar_url)
      `,
        { count: "exact" },
      );
    } else {
      query = supabase.from("pets").select(
        `
        *,
        reporter:profiles(id, username, full_name, avatar_url)
      `,
        { count: "exact" },
      );
    }

    if (type) query = query.eq("type", type);
    if (species) query = query.eq("species", species);
    query = query.eq("status", status);

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    query = query.range(from, to).order("created_at", { ascending: false });

    const { data: reports, error, count } = await query;
    if (error) {
      return errorResponse(error.message, 500);
    }

    return paginatedResponse(reports || [], count || 0, page, perPage);
  } catch (err) {
    const error = err as Error;
    return errorResponse(error.message || "Internal server error", 500);
  }
}

// POST /api/pets — Create a pet report
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    const body = await request.json();
    const result = createPetReportSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.errors[0].message, 400);
    }

    const { lat, lng, ...reportData } = result.data;

    const { data: report, error } = await supabase
      .from("pets")
      .insert({
        ...reportData,
        reporter_id: user.id,
        location: `POINT(${lng} ${lat})`,
      })
      .select()
      .single();

    if (error) {
      return errorResponse(error.message, 400);
    }

    // Auto-matching logic for "found" reports against "lost" reports
    if (reportData.type === "found") {
      const { data: lostReports } = await supabase
        .from("pets")
        .select("id, species, breed, color, reporter_id")
        .eq("type", "lost")
        .eq("status", "active")
        .eq("species", reportData.species);

      if (lostReports) {
        // Simplified matching: look for similar attributes
        const reportStr =
          `${reportData.breed || ""} ${reportData.color || ""}`.toLowerCase();

        for (const lost of lostReports) {
          const lostStr =
            `${lost.breed || ""} ${lost.color || ""}`.toLowerCase();
          // Find common words
          const reportWords = reportStr.split(/\s+/).filter(Boolean);
          const matchScore = reportWords.filter((w) =>
            lostStr.includes(w),
          ).length;

          if (matchScore > 0 || (!reportData.breed && !reportData.color)) {
            // Create match via security-definer RPC (bypasses RLS on pet_matches)
            await supabase.rpc("create_pet_match", {
              _lost_report_id: lost.id,
              _found_report_id: report.id,
              _confidence_score: Math.min(100, matchScore * 20 + 50),
              _matched_traits: reportWords.filter((w) => lostStr.includes(w)),
            });

            // Notify original reporter
            await supabase.rpc("create_notification", {
              _user_id: lost.reporter_id,
              _type: "system",
              _title: "Potential Pet Match",
              _body: "We found a pet report that might match your lost pet.",
              _action_url: `/pets/match`,
              _metadata: { report_id: report.id },
            });
          }
        }
      }
    }

    return successResponse(report, 201);
  } catch (err) {
    const error = err as Error;
    if (error.message === "Unauthorized")
      return errorResponse("Unauthorized", 401);
    return errorResponse(error.message || "Internal server error", 500);
  }
}
