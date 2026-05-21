"use server";

import { revalidatePath } from "next/cache";
import {
  buildLinks,
  candidateProfileFormSchema,
  splitLines,
  type CandidateProfileFieldErrors
} from "./profile-schema";
import { getCurrentUserOrRedirect } from "@/features/applications/queries";

export type CandidateProfileActionState = {
  error?: string;
  success?: string;
  fieldErrors?: CandidateProfileFieldErrors;
};

export async function saveCandidateProfileAction(
  _previousState: CandidateProfileActionState,
  formData: FormData
): Promise<CandidateProfileActionState> {
  const parsed = candidateProfileFormSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  const { supabase, user } = await getCurrentUserOrRedirect();
  const input = parsed.data;

  const { error } = await supabase.from("candidate_profiles").upsert(
    {
      user_id: user.id,
      headline: input.headline,
      summary: input.summary || "",
      skills: splitLines(input.skills),
      project_bullets: splitLines(input.projectBullets),
      education: input.education || "",
      languages: splitLines(input.languages),
      links: buildLinks(input),
      preferred_roles: splitLines(input.preferredRoles)
    },
    {
      onConflict: "user_id"
    }
  );

  if (error) {
    return {
      error: "Could not save candidate profile. Check that the Supabase migration has been applied."
    };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");

  return {
    success: "Candidate profile saved."
  };
}
