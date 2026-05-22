import type { Application } from "@/features/applications/application-schema";
import { getCurrentUserOrRedirect, listApplicationsForCurrentUser } from "@/features/applications/queries";
import type { DashboardMatchReport } from "./metrics";

export type DashboardDataResult =
  | {
      ok: true;
      applications: Application[];
      matchReports: DashboardMatchReport[];
    }
  | {
      ok: false;
      error: string;
    };

export async function getDashboardDataForCurrentUser(): Promise<DashboardDataResult> {
  const applicationsResult = await listApplicationsForCurrentUser();

  if (!applicationsResult.ok) {
    return applicationsResult;
  }

  const { supabase } = await getCurrentUserOrRedirect();
  const { data: matchReports, error } = await supabase
    .from("match_reports")
    .select("application_id, missing_skills, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return {
      ok: false,
      error: "Applications loaded, but saved match reports could not be loaded for dashboard analytics."
    };
  }

  return {
    ok: true,
    applications: applicationsResult.applications,
    matchReports: (matchReports ?? []).map((report) => ({
      applicationId: report.application_id,
      missingSkills: report.missing_skills ?? [],
      createdAt: report.created_at
    }))
  };
}
