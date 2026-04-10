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

const parseTimeToMinutes = (time: string | null | undefined): number | null => {
  if (!time) return null;

  const parts = time.split(":");
  if (parts.length < 2) return null;

  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

  return hours * 60 + minutes;
};

const isWithinQuietHours = (
  start: string | null | undefined,
  end: string | null | undefined,
  now: Date = new Date(),
): boolean => {
  const startMinutes = parseTimeToMinutes(start);
  const endMinutes = parseTimeToMinutes(end);

  if (startMinutes === null || endMinutes === null) return false;

  // Same time is treated as disabled quiet hours rather than a full-day mute.
  if (startMinutes === endMinutes) return false;

  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  if (startMinutes < endMinutes) {
    return nowMinutes >= startMinutes && nowMinutes < endMinutes;
  }

  // Overnight window, e.g. 22:00 -> 06:00
  return nowMinutes >= startMinutes || nowMinutes < endMinutes;
};

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
