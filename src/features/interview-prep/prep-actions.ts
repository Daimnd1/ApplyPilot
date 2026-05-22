"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserOrRedirect } from "@/features/applications/queries";
import { generateInterviewPrep } from "./prep-generator";
import { interviewPrepApplicationSchema, interviewPrepNotesSchema } from "./prep-schema";

export type InterviewPrepActionState = {
  error?: string;
  success?: string;
  fieldErrors?: {
    notes?: string[];
  };
};

export async function generateInterviewPrepAction(
  _previousState: InterviewPrepActionState,
  formData: FormData
): Promise<InterviewPrepActionState> {
  const parsed = interviewPrepApplicationSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      error: "Invalid application id."
    };
  }

  const { supabase } = await getCurrentUserOrRedirect();
  const applicationId = parsed.data.applicationId;
  const [{ data: application, error: applicationError }, { data: jobDescription, error: jobError }] =
    await Promise.all([
      supabase.from("applications").select("company, role_title").eq("id", applicationId).maybeSingle(),
      supabase
        .from("job_descriptions")
        .select("extracted_skills, responsibilities")
        .eq("application_id", applicationId)
        .maybeSingle()
    ]);

  if (applicationError || jobError) {
    return {
      error: "Could not load application and job analysis for interview prep."
    };
  }

  if (!application || !jobDescription) {
    return {
      error: "Save an application job description before generating interview prep."
    };
  }

  const prep = generateInterviewPrep({
    company: application.company,
    roleTitle: application.role_title,
    extractedSkills: jobDescription.extracted_skills ?? [],
    responsibilities: jobDescription.responsibilities ?? []
  });

  const { error } = await supabase.from("interview_prep").upsert(
    {
      application_id: applicationId,
      technical_questions: prep.technicalQuestions,
      behavioral_questions: prep.behavioralQuestions,
      company_questions: prep.companyQuestions
    },
    {
      onConflict: "application_id",
      ignoreDuplicates: false
    }
  );

  if (error) {
    return {
      error: "Could not save interview prep."
    };
  }

  revalidatePath(`/applications/${applicationId}`);

  return {
    success: "Interview prep generated."
  };
}

export async function saveInterviewPrepNotesAction(
  _previousState: InterviewPrepActionState,
  formData: FormData
): Promise<InterviewPrepActionState> {
  const parsed = interviewPrepNotesSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  const { supabase } = await getCurrentUserOrRedirect();
  const { applicationId, notes } = parsed.data;
  const { error } = await supabase
    .from("interview_prep")
    .update({ notes })
    .eq("application_id", applicationId);

  if (error) {
    return {
      error: "Could not save interview prep notes."
    };
  }

  revalidatePath(`/applications/${applicationId}`);

  return {
    success: "Interview prep notes saved."
  };
}
