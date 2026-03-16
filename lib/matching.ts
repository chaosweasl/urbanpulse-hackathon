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
  nearbyProfiles: Profile[]
): MatchResult[] {
  const matches: MatchResult[] = [];

  // Extract keywords from pulse for basic matching
  const text = `${pulse.title} ${pulse.description}`.toLowerCase();

  // Current time to check quiet hours
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentSeconds = currentHours * 3600 + currentMinutes * 60 + now.getSeconds();

  const isWithinQuietHours = (start?: string | null, end?: string | null) => {
    if (!start || !end) return false;

    // Parse "HH:MM:SS"
    const parseTime = (t: string) => {
      const parts = t.split(":");
      return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + (parseInt(parts[2]) || 0);
    };

    const startSecs = parseTime(start);
    const endSecs = parseTime(end);

    if (startSecs < endSecs) {
      return currentSeconds >= startSecs && currentSeconds <= endSecs;
    } else {
      // Crosses midnight
      return currentSeconds >= startSecs || currentSeconds <= endSecs;
    }
  };

  for (const profile of nearbyProfiles) {
    // 1. Availability check
    if (!profile.is_available) continue;

    // 2. Quiet hours check
    if (isWithinQuietHours(profile.quiet_hours_start, profile.quiet_hours_end)) continue;

    // 3. Distance check (already partially filtered by nearby query, but verify against max_distance_km)
    let distance = 0;
    if (pulse.location && profile.location) {
       // Coordinates extraction depends on the actual format
       // Assuming standard postgis point logic or custom parsing
       // If coords are available on objects
       if ((pulse as any).lat && (pulse as any).lng && (profile as any).lat && (profile as any).lng) {
          distance = haversineDistance(
             (pulse as any).lat, (pulse as any).lng,
             (profile as any).lat, (profile as any).lng
          );
          if (profile.neighborhood_radius_km && distance > profile.neighborhood_radius_km * 1000) {
             continue;
          }
       }
    }

    // 4. Skills matching
    const profileSkills = profile.skill_tags || [];
    const matchingSkills = profileSkills.filter(skill => text.includes(skill.toLowerCase()));

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
