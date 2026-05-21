import { APPLICATION_STATUSES } from "@/features/applications/application-status";
import type { Application } from "@/features/applications/application-schema";

export function buildDashboardMetrics(applications: Application[]) {
  const totalApplications = applications.length;
  const interviewCount = applications.filter((application) =>
    ["interviewing", "offer"].includes(application.status)
  ).length;

  const responseRate =
    totalApplications === 0 ? 0 : Math.round((interviewCount / totalApplications) * 100);

  const statusDistribution = APPLICATION_STATUSES.map((status) => ({
    status,
    count: applications.filter((application) => application.status === status).length
  })).filter((item) => item.count > 0);

  const frequentSkills = applications
    .flatMap((application) => application.skills)
    .reduce<Record<string, number>>((accumulator, skill) => {
      accumulator[skill] = (accumulator[skill] ?? 0) + 1;
      return accumulator;
    }, {});

  return {
    totalApplications,
    interviewCount,
    responseRate,
    statusDistribution,
    frequentSkills: Object.entries(frequentSkills)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
  };
}
