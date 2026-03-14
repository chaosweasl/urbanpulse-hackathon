// ─── Pet Types ──────────────────────────────────────────

export type PetReportType = "lost" | "found";
export type PetSpecies = "dog" | "cat" | "bird" | "other";

export interface PetReport {
  id: string;
  created_at: string;
  updated_at: string;
  reporter_id: string;
  type: PetReportType;
  species: PetSpecies;
  breed: string | null;
  color: string;
  name: string | null;
  description: string;
  photo_url: string | null;
  latitude: number;
  longitude: number;
  is_resolved: boolean;
  resolved_at: string | null;
}

export interface PetMatch {
  lost_report_id: string;
  found_report_id: string;
  confidence_score: number; // 0–100
  matched_traits: string[];
  created_at: string;
}
