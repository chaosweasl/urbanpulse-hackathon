import { NextResponse } from "next/server";

// GET /api/users/[slug] — Public profile
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  // TODO: Fetch user profile by slug (not UUID)
  // TODO: Return public profile data + trust score
  return NextResponse.json(
    { success: false, error: `User ${slug} not implemented` },
    { status: 501 }
  );
}
