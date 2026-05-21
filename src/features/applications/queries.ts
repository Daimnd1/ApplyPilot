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
      "id, company, role_title, location, work_mode, job_url, status, deadline, notes, contact_name, skills, created_at, updated_at"
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
