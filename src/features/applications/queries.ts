import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Application } from "./application-schema";
import { mapApplicationRow } from "./application-schema";

export type ApplicationsResult =
  | {
      ok: true;
      applications: Application[];
    }
  | {
      ok: false;
      error: string;
    };

export type JobDescriptionAnalysis = {
  rawText: string;
  extractedSkills: string[];
  responsibilities: string[];
  keywords: string[];
  seniorityLevel: string;
  languageRequirements: string[];
  parsedAt: string;
};

export type ApplicationDetailsResult =
  | {
      ok: true;
      application: Application;
      jobDescription: JobDescriptionAnalysis | null;
    }
  | {
      ok: false;
      error: string;
      notFound?: boolean;
    };

export async function getCurrentUserOrRedirect() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return {
    supabase,
    user
  };
}

export async function listApplicationsForCurrentUser(): Promise<ApplicationsResult> {
  const { supabase } = await getCurrentUserOrRedirect();

  const { data, error } = await supabase
    .from("applications")
    .select(
      "id, company, role_title, location, work_mode, job_url, status, deadline, notes, contact_name, salary, skills, created_at, updated_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return {
      ok: false,
      error: "Could not load applications. Check that the Supabase migration has been applied."
    };
  }

  return {
    ok: true,
    applications: (data ?? []).map((row) => mapApplicationRow(row))
  };
}

export async function getApplicationDetailsForCurrentUser(id: string): Promise<ApplicationDetailsResult> {
  const { supabase } = await getCurrentUserOrRedirect();

  const { data: application, error: applicationError } = await supabase
    .from("applications")
    .select(
      "id, company, role_title, location, work_mode, job_url, status, deadline, notes, contact_name, salary, skills, created_at, updated_at"
    )
    .eq("id", id)
    .maybeSingle();

  if (applicationError) {
    return {
      ok: false,
      error: "Could not load application. Check that the Supabase migration has been applied."
    };
  }

  if (!application) {
    return {
      ok: false,
      error: "Application not found.",
      notFound: true
    };
  }

  const { data: jobDescription, error: jobDescriptionError } = await supabase
    .from("job_descriptions")
    .select(
      "raw_text, extracted_skills, responsibilities, keywords, seniority_level, language_requirements, parsed_at"
    )
    .eq("application_id", id)
    .maybeSingle();

  if (jobDescriptionError) {
    return {
      ok: false,
      error: "Application loaded, but job-description analysis could not be loaded."
    };
  }

  return {
    ok: true,
    application: mapApplicationRow(application),
    jobDescription: jobDescription
      ? {
          rawText: jobDescription.raw_text,
          extractedSkills: jobDescription.extracted_skills ?? [],
          responsibilities: jobDescription.responsibilities ?? [],
          keywords: jobDescription.keywords ?? [],
          seniorityLevel: jobDescription.seniority_level,
          languageRequirements: jobDescription.language_requirements ?? [],
          parsedAt: jobDescription.parsed_at
        }
      : null
  };
}
