"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Route } from "next";
import {
  createApplicationSchema,
  deleteApplicationSchema,
  updateApplicationSchema,
  type ApplicationFormFieldErrors
} from "./application-schema";
import { getCurrentUserOrRedirect } from "./queries";
import { parseJobDescription } from "@/features/job-analysis/parser";

export type ApplicationActionState = {
  error?: string;
  fieldErrors?: ApplicationFormFieldErrors;
};

export async function createApplicationAction(
  _previousState: ApplicationActionState,
  formData: FormData
): Promise<ApplicationActionState> {
  const parsed = createApplicationSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  const { supabase, user } = await getCurrentUserOrRedirect();
  const input = parsed.data;
  const parsedJob = input.jobDescription ? parseJobDescription(input.jobDescription) : null;

  const { data: application, error: applicationError } = await supabase
    .from("applications")
    .insert({
      user_id: user.id,
      company: input.company,
      role_title: input.roleTitle,
      location: input.location || null,
      work_mode: input.workMode,
      job_url: input.jobUrl || null,
      status: input.status,
      deadline: input.deadline || null,
      notes: input.notes || "",
      contact_name: input.contactName || null,
      salary: input.salary || null,
      skills: parsedJob?.extractedSkills ?? []
    })
    .select("id")
    .single();

  if (applicationError || !application) {
    return {
      error: "Could not save application. Check that the Supabase migration has been applied."
    };
  }

  if (input.jobDescription && parsedJob) {
    const { error: jobDescriptionError } = await supabase.from("job_descriptions").insert({
      application_id: application.id,
      raw_text: input.jobDescription,
      extracted_skills: parsedJob.extractedSkills,
      responsibilities: parsedJob.responsibilities,
      keywords: parsedJob.keywords,
      seniority_level: parsedJob.seniorityLevel,
      language_requirements: parsedJob.languageRequirements
    });

    if (jobDescriptionError) {
      return {
        error: "Application was saved, but the job description analysis could not be saved."
      };
    }
  }

  revalidatePath("/applications");
  revalidatePath("/dashboard");
  redirect("/applications");
}

export async function updateApplicationAction(
  _previousState: ApplicationActionState,
  formData: FormData
): Promise<ApplicationActionState> {
  const parsed = updateApplicationSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  const { supabase } = await getCurrentUserOrRedirect();
  const input = parsed.data;
  const parsedJob = input.jobDescription ? parseJobDescription(input.jobDescription) : null;
  const applicationUpdate = {
    company: input.company,
    role_title: input.roleTitle,
    location: input.location || null,
    work_mode: input.workMode,
    job_url: input.jobUrl || null,
    status: input.status,
    deadline: input.deadline || null,
    notes: input.notes || "",
    contact_name: input.contactName || null,
    salary: input.salary || null,
    ...(parsedJob ? { skills: parsedJob.extractedSkills } : {})
  };

  const { error: applicationError } = await supabase
    .from("applications")
    .update(applicationUpdate)
    .eq("id", input.id);

  if (applicationError) {
    return {
      error: "Could not update application."
    };
  }

  if (input.jobDescription && parsedJob) {
    const { error: jobDescriptionError } = await supabase.from("job_descriptions").upsert(
      {
        application_id: input.id,
        raw_text: input.jobDescription,
        extracted_skills: parsedJob.extractedSkills,
        responsibilities: parsedJob.responsibilities,
        keywords: parsedJob.keywords,
        seniority_level: parsedJob.seniorityLevel,
        language_requirements: parsedJob.languageRequirements,
        parsed_at: new Date().toISOString()
      },
      {
        onConflict: "application_id"
      }
    );

    if (jobDescriptionError) {
      return {
        error: "Application was updated, but the job description analysis could not be saved."
      };
    }
  }

  revalidatePath("/applications");
  revalidatePath(`/applications/${input.id}`);
  revalidatePath("/dashboard");
  redirect(`/applications/${input.id}` as Route);
}

export async function deleteApplicationAction(formData: FormData) {
  const parsed = deleteApplicationSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect("/applications");
  }

  const { supabase } = await getCurrentUserOrRedirect();
  await supabase.from("applications").delete().eq("id", parsed.data.id);

  revalidatePath("/applications");
  revalidatePath("/dashboard");
  redirect("/applications");
}
