import { APPLICATION_STATUSES } from "@/features/applications/application-status";
import type { Application } from "@/features/applications/application-schema";

export type DashboardMatchReport = {
  applicationId: string;
  missingSkills: string[];
  createdAt: string;
};

export function buildDashboardMetrics(
  applications: Application[],
  matchReports: DashboardMatchReport[] = []
) {
  const totalApplications = applications.length;
  const interviewCount = applications.filter((application) =>
    ["interviewing", "offer"].includes(application.status)
  ).length;
  const responseCount = applications.filter((application) =>
    ["interviewing", "offer", "rejected"].includes(application.status)
  ).length;

  const responseRate =
    totalApplications === 0 ? 0 : Math.round((responseCount / totalApplications) * 100);

  const statusDistribution = APPLICATION_STATUSES.map((status) => ({
    status,
    count: applications.filter((application) => application.status === status).length
  })).filter((item) => item.count > 0);

  const frequentSkills = countValues(applications.flatMap((application) => application.skills));
  const latestMatchReports = latestReportsByApplication(matchReports);
  const recurringGaps = countValues(latestMatchReports.flatMap((report) => report.missingSkills));

  return {
    totalApplications,
    interviewCount,
    responseCount,
    responseRate,
    statusDistribution,
    frequentSkills: toRankedItems(frequentSkills, "skill"),
    recurringGaps: toRankedItems(recurringGaps, "skill")
  };
}

function latestReportsByApplication(matchReports: DashboardMatchReport[]) {
  const latestReports = new Map<string, DashboardMatchReport>();

  for (const report of matchReports) {
    const currentReport = latestReports.get(report.applicationId);

    if (!currentReport || currentReport.createdAt < report.createdAt) {
      latestReports.set(report.applicationId, report);
    }
  }

  return [...latestReports.values()];
}

function countValues(values: string[]) {
  return values.reduce<Record<string, number>>((accumulator, value) => {
    const normalizedValue = value.trim();

    if (normalizedValue) {
      accumulator[normalizedValue] = (accumulator[normalizedValue] ?? 0) + 1;
    }

    return accumulator;
  }, {});
}

function toRankedItems<TName extends string>(
  values: Record<string, number>,
  name: TName
): Array<Record<TName, string> & { count: number }> {
  return Object.entries(values)
    .map(([value, count]) => ({ [name]: value, count }) as Record<TName, string> & { count: number })
    .sort((a, b) => b.count - a.count || a[name].localeCompare(b[name]));
}
