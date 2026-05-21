"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserOrRedirect } from "@/features/applications/queries";
import { matchCandidateToJob } from "./match";
import { matchReportApplicationSchema } from "./match-report-schema";

export type MatchReportActionState = {
  error?: string;
  success?: string;
};

export async function generateMatchReportAction(
  _previousState: MatchReportActionState,
  formData: FormData
): Promise<MatchReportActionState> {
  const parsed = matchReportApplicationSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      error: "Invalid application id."
    };
  }

  const { supabase } = await getCurrentUserOrRedirect();
  const applicationId = parsed.data.applicationId;

  const [{ data: profile, error: profileError }, { data: jobDescription, error: jobError }] =
    await Promise.all([
      supabase.from("candidate_profiles").select("skills, project_bullets").maybeSingle(),
      supabase.from("job_descriptions").select("extracted_skills").eq("application_id", applicationId).maybeSingle()
    ]);

  if (profileError || jobError) {
    return {
      error: "Could not load the candidate profile or job analysis for matching."
    };
  }

  if (!profile || profile.skills.length === 0) {
    return {
      error: "Add candidate profile skills before generating a match report."
    };
  }

  if (!jobDescription || jobDescription.extracted_skills.length === 0) {
    return {
      error: "Save a job description with extracted skills before generating a match report."
    };
  }

  const report = matchCandidateToJob(
    {
      skills: profile.skills,
      projectBullets: profile.project_bullets ?? []
    },
    {
      extractedSkills: jobDescription.extracted_skills
    }
  );

  const { error } = await supabase.from("match_reports").insert({
    application_id: applicationId,
    matched_skills: report.matchedSkills,
    missing_skills: report.missingSkills,
    score: report.score,
    recommendations: report.recommendations
  });

  if (error) {
    return {
      error: "Could not save match report."
    };
  }

  revalidatePath(`/applications/${applicationId}`);
  revalidatePath("/dashboard");

  return {
    success: "Match report generated."
  };
}
