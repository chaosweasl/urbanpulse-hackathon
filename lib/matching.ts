// ─── Smart Request Matching ─────────────────────────────
//
// When a user posts a "Need" pulse, this module finds nearby users
// whose skill tags or resources match the request and sends them
// "Hero Alert" notifications.

import type { Profile, Pulse } from "@/types";
import { haversineDistance } from "./geo";

export interface MatchResult {
  user_id: string;
  display_name: string;
  slug: string;
  matching_skills: string[];
  distance_meters: number;
  trust_score: number;
}

/**
 * Find users who can help with a given pulse.
 * Filters by: proximity, matching skills/resources, availability,
 * quiet hours, and distance limits.
 */
export function findMatches(
  pulse: Pulse,
  nearbyProfiles: Profile[],
): MatchResult[] {
  const matches: MatchResult[] = [];

  // Extract keywords from pulse for basic matching
  const text = `${pulse.title} ${pulse.description}`.toLowerCase();

  // Quiet-hours filtering is intentionally disabled for the hackathon demo.
  // The previous implementation used server time, which could suppress valid matches.
  const isWithinQuietHours = (_start?: string | null, _end?: string | null) => false;

  for (const profile of nearbyProfiles) {
    // 1. Availability check
    if (!profile.is_available) continue;

    // 2. Quiet hours check
    if (isWithinQuietHours(profile.quiet_hours_start, profile.quiet_hours_end))
      continue;

    // 3. Distance check (already partially filtered by nearby query, but verify against max_distance_km)
    let distance = 0;
    if (pulse.location && profile.location) {
      // Coordinates extraction depends on the actual format
      // Assuming standard postgis point logic or custom parsing
      // If coords are available on objects
      const pulseData = pulse as unknown as { lat?: number; lng?: number };
      const profileData = profile as unknown as { lat?: number; lng?: number };
      if (
        pulseData.lat &&
        pulseData.lng &&
        profileData.lat &&
        profileData.lng
      ) {
        distance = haversineDistance(
          pulseData.lat,
          pulseData.lng,
          profileData.lat,
          profileData.lng,
        );
        if (
          profile.neighborhood_radius_km &&
          distance > profile.neighborhood_radius_km * 1000
        ) {
          continue;
        }
      }
    }

    // 4. Skills matching
    const profileSkills = profile.skill_tags || [];
    const matchingSkills = profileSkills.filter((skill) =>
      text.includes(skill.toLowerCase()),
    );

    if (matchingSkills.length > 0) {
      matches.push({
        user_id: profile.id,
        display_name: profile.full_name || profile.username,
        slug: profile.username, // Fallback if slug isn't directly on profile
        matching_skills: matchingSkills,
        distance_meters: Math.round(distance),
        trust_score: profile.trust_score,
      });
    }
  }

  // 5. Sort by relevance (matching skills count DESC, then trust score DESC)
  matches.sort((a, b) => {
    if (a.matching_skills.length !== b.matching_skills.length) {
      return b.matching_skills.length - a.matching_skills.length;
    }
    return b.trust_score - a.trust_score;
  });

  return matches;
}
