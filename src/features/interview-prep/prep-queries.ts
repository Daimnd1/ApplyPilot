import { getCurrentUserOrRedirect } from "@/features/applications/queries";
import { mapSavedInterviewPrepRow, type SavedInterviewPrep } from "./prep-schema";

export type InterviewPrepResult =
  | {
      ok: true;
      prep: SavedInterviewPrep | null;
    }
  | {
      ok: false;
      error: string;
    };

export async function getInterviewPrepForApplication(applicationId: string): Promise<InterviewPrepResult> {
  const { supabase } = await getCurrentUserOrRedirect();

  const { data, error } = await supabase
    .from("interview_prep")
    .select(
      "id, application_id, technical_questions, behavioral_questions, company_questions, notes, created_at, updated_at"
    )
    .eq("application_id", applicationId)
    .maybeSingle();

  if (error) {
    return {
      ok: false,
      error: "Could not load interview prep."
    };
  }

  return {
    ok: true,
    prep: data ? mapSavedInterviewPrepRow(data) : null
  };
}
