import { getCurrentUserOrRedirect } from "@/features/applications/queries";
import type { SavedMatchReport } from "./match-report-schema";
import { mapSavedMatchReportRow } from "./match-report-schema";

export type MatchReportsResult =
  | {
      ok: true;
      reports: SavedMatchReport[];
    }
  | {
      ok: false;
      error: string;
    };

export async function listMatchReportsForApplication(applicationId: string): Promise<MatchReportsResult> {
  const { supabase } = await getCurrentUserOrRedirect();

  const { data, error } = await supabase
    .from("match_reports")
    .select("id, application_id, matched_skills, missing_skills, score, recommendations, created_at")
    .eq("application_id", applicationId)
    .order("created_at", { ascending: false });

  if (error) {
    return {
      ok: false,
      error: "Could not load match reports."
    };
  }

  return {
    ok: true,
    reports: (data ?? []).map((row) => mapSavedMatchReportRow(row))
  };
}
