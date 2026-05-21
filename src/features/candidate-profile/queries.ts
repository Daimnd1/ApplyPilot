import { getCurrentUserOrRedirect } from "@/features/applications/queries";
import type { CandidateProfile } from "./profile-schema";
import { mapCandidateProfileRow } from "./profile-schema";

export type CandidateProfileResult =
  | {
      ok: true;
      profile: CandidateProfile | null;
    }
  | {
      ok: false;
      error: string;
    };

export async function getCandidateProfileForCurrentUser(): Promise<CandidateProfileResult> {
  const { supabase } = await getCurrentUserOrRedirect();

  const { data, error } = await supabase
    .from("candidate_profiles")
    .select("id, headline, summary, skills, project_bullets, education, languages, links, preferred_roles")
    .maybeSingle();

  if (error) {
    return {
      ok: false,
      error: "Could not load candidate profile. Check that the Supabase migration has been applied."
    };
  }

  return {
    ok: true,
    profile: data ? mapCandidateProfileRow(data) : null
  };
}
