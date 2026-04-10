import { createClient } from "@/utils/supabase/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api-helpers";
import { updatePulseSchema } from "@/lib/validators";

type SupabaseClientType = Awaited<ReturnType<typeof createClient>>;

type PulseRow = Record<string, unknown> & {
  lat?: number | null;
  lng?: number | null;
};

const parsePointText = (value: string): { lat: number; lng: number } | null => {
  const pointMatch = value.match(/POINT\(\s*([-+]?\d*\.?\d+)\s+([-+]?\d*\.?\d+)\s*\)/i);
  if (!pointMatch) return null;

  const lng = Number(pointMatch[1]);
  const lat = Number(pointMatch[2]);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return { lat, lng };
};

const parseWkbPointHex = (value: string): { lat: number; lng: number } | null => {
  const normalized = value.trim().replace(/^\\x/i, "").replace(/^0x/i, "");
  if (!/^[0-9a-fA-F]+$/.test(normalized) || normalized.length % 2 !== 0) {
    return null;
  }

  const bytes = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < normalized.length; i += 2) {
    bytes[i / 2] = Number.parseInt(normalized.slice(i, i + 2), 16);
  }

  if (bytes.length < 21) {
    return null;
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const littleEndian = view.getUint8(0) === 1;
  const typeWithFlags = view.getUint32(1, littleEndian);
  const hasSrid = (typeWithFlags & 0x20000000) !== 0;

  let offset = 5;
  if (hasSrid) {
    offset += 4;
  }

  if (bytes.length < offset + 16) {
    return null;
  }

  const lng = view.getFloat64(offset, littleEndian);
  const lat = view.getFloat64(offset + 8, littleEndian);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return null;
  }

  return { lat, lng };
};

const extractCoordinatesFromLocation = (location: unknown): { lat: number; lng: number } | null => {
  if (!location) {
    return null;
  }

  if (typeof location === "object") {
    const value = location as {
      lat?: unknown;
      lng?: unknown;
      coordinates?: unknown;
    };

    if (typeof value.lat === "number" && typeof value.lng === "number") {
      return { lat: value.lat, lng: value.lng };
    }

    if (
      Array.isArray(value.coordinates)
      && value.coordinates.length >= 2
      && typeof value.coordinates[0] === "number"
      && typeof value.coordinates[1] === "number"
    ) {
      return {
        lat: value.coordinates[1],
        lng: value.coordinates[0],
      };
    }

    return null;
  }

  if (typeof location === "string") {
    const parsedPoint = parsePointText(location);
    if (parsedPoint) {
      return parsedPoint;
    }

    const parsedWkb = parseWkbPointHex(location);
    if (parsedWkb) {
      return parsedWkb;
    }

    try {
      const parsedJson = JSON.parse(location) as unknown;
      return extractCoordinatesFromLocation(parsedJson);
    } catch {
      return null;
    }
  }

  return null;
};

const normalizePulseLocation = (pulse: PulseRow): PulseRow => {
  const extracted = extractCoordinatesFromLocation(pulse.location);
  const lat = typeof pulse.lat === "number" ? pulse.lat : extracted?.lat ?? null;
  const lng = typeof pulse.lng === "number" ? pulse.lng : extracted?.lng ?? null;

  return {
    ...pulse,
    lat,
    lng,
    location: lat !== null && lng !== null ? { lat, lng } : pulse.location ?? null,
  };
};

const attachCoordinates = async (
  _supabase: SupabaseClientType,
  pulse: PulseRow,
): Promise<PulseRow> => {
  return normalizePulseLocation(pulse);
};

// GET /api/pulses/[pulseId] — Get a single pulse
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pulseId: string }> },
) {
  try {
    const { pulseId } = await params;
    const supabase = await createClient();

    const { data: pulse, error } = await supabase
      .from("pulses")
      .select(
        `
        *,
        author:profiles(id, username, full_name, avatar_url, trust_score, is_verified_neighbor)
      `,
      )
      .eq("id", pulseId)
      .single();

    if (error || !pulse) {
      return errorResponse("Pulse not found", 404);
    }

    const normalizedPulse = await attachCoordinates(supabase, (pulse || {}) as PulseRow);
    return successResponse(normalizedPulse);
  } catch (err) {
    const error = err as Error;
    return errorResponse(error.message || "Internal server error", 500);
  }
}

// PATCH /api/pulses/[pulseId] — Update a pulse
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ pulseId: string }> },
) {
  try {
    const { pulseId } = await params;
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    // Check user is author or admin
    const { data: pulse, error: fetchError } = await supabase
      .from("pulses")
      .select("author_id")
      .eq("id", pulseId)
      .single();

    if (fetchError || !pulse) {
      return errorResponse("Pulse not found", 404);
    }

    const isAuthor = pulse.author_id === user.id;
    let isAdmin = false;

    if (!isAuthor) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();
      isAdmin = !!profile?.is_admin;
    }

    if (!isAuthor && !isAdmin) {
      return errorResponse("Forbidden", 403);
    }

    const body = await request.json();
    const result = updatePulseSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.issues[0].message, 400);
    }

    const { lat, lng, ...updates } = result.data;
    const dbUpdates: Record<string, unknown> = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (lat !== undefined && lng !== undefined) {
      dbUpdates.location = `POINT(${lng} ${lat})`;
    }

    const { data: updatedPulse, error } = await supabase
      .from("pulses")
      .update(dbUpdates)
      .eq("id", pulseId)
      .select("*")
      .single();

    if (error) {
      return errorResponse(error.message, 400);
    }

    const normalizedPulse = await attachCoordinates(supabase, (updatedPulse || {}) as PulseRow);
    return successResponse(normalizedPulse);
  } catch (err) {
    const error = err as Error;
    if (error.message === "Unauthorized")
      return errorResponse("Unauthorized", 401);
    return errorResponse(error.message || "Internal server error", 500);
  }
}

// DELETE /api/pulses/[pulseId] — Delete a pulse
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ pulseId: string }> },
) {
  try {
    const { pulseId } = await params;
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    // Check user is author or admin
    const { data: pulse, error: fetchError } = await supabase
      .from("pulses")
      .select("author_id")
      .eq("id", pulseId)
      .single();

    if (fetchError || !pulse) {
      return errorResponse("Pulse not found", 404);
    }

    const isAuthor = pulse.author_id === user.id;
    let isAdmin = false;

    if (!isAuthor) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();
      isAdmin = !!profile?.is_admin;
    }

    if (!isAuthor && !isAdmin) {
      return errorResponse("Forbidden", 403);
    }

    // Soft delete by updating status
    const { error } = await supabase
      .from("pulses")
      .update({ status: "expired", updated_at: new Date().toISOString() })
      .eq("id", pulseId);

    if (error) {
      return errorResponse(error.message, 400);
    }

    return successResponse({ message: "Pulse deleted" });
  } catch (err) {
    const error = err as Error;
    if (error.message === "Unauthorized")
      return errorResponse("Unauthorized", 401);
    return errorResponse(error.message || "Internal server error", 500);
  }
}
