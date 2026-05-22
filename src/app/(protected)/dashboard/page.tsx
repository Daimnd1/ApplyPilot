import { BriefcaseBusiness, ChartNoAxesCombined, CircleAlert, Target } from "lucide-react";
import Link from "next/link";
import { buildDashboardMetrics } from "@/features/dashboard/metrics";
import { getDashboardDataForCurrentUser } from "@/features/dashboard/queries";
import { buttonStyles } from "@/components/ui/button";

export default async function DashboardPage() {
  const result = await getDashboardDataForCurrentUser();

  if (!result.ok) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {result.error}
        </div>
      </main>
    );
  }

  const metrics = buildDashboardMetrics(result.applications, result.matchReports);
  const strongestStatusCount = Math.max(...metrics.statusDistribution.map((status) => status.count), 1);
  const strongestSkillCount = metrics.frequentSkills[0]?.count ?? 1;
  const strongestGapCount = metrics.recurringGaps[0]?.count ?? 1;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid gap-4 md:grid-cols-4">
        <Metric label="Applications" value={metrics.totalApplications} icon={<BriefcaseBusiness size={20} />} />
        <Metric label="Response rate" value={`${metrics.responseRate}%`} icon={<ChartNoAxesCombined size={20} />} />
        <Metric label="Interviews" value={metrics.interviewCount} icon={<Target size={20} />} />
        <Metric label="Recurring gaps" value={metrics.recurringGaps.length} icon={<CircleAlert size={20} />} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5 shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[var(--line)] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Application Pipeline</h1>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Status distribution from saved applications.
              </p>
            </div>
            <Link href="/applications/new" className={buttonStyles}>
              New application
            </Link>
          </div>

          {metrics.statusDistribution.length > 0 ? (
            <div className="mt-5 space-y-4">
              {metrics.statusDistribution.map((status) => (
                <DistributionRow
                  key={status.status}
                  label={status.status.replace("-", " ")}
                  count={status.count}
                  maxCount={strongestStatusCount}
                />
              ))}
            </div>
          ) : (
            <EmptyAnalytics
              title="No tracked applications yet."
              text="Add an application to start building the pipeline."
            />
          )}
        </div>

        <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Frequent Job Skills</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Extracted from saved job descriptions.</p>
          {metrics.frequentSkills.length > 0 ? (
            <RankedList
              items={metrics.frequentSkills.slice(0, 6)}
              maxCount={strongestSkillCount}
              tone="skill"
            />
          ) : (
            <EmptyAnalytics
              title="No job skills saved."
              text="Paste job descriptions when adding applications to populate this view."
            />
          )}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Search Signals</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <Signal label="Responses" value={metrics.responseCount} note="Interviewing, offer, or rejected" />
            <Signal label="Saved reports" value={result.matchReports.length} note="Used for recurring gaps" />
          </div>
        </div>

        <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Recurring Match Gaps</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Missing skills from the latest saved report for each application.
          </p>
          {metrics.recurringGaps.length > 0 ? (
            <RankedList items={metrics.recurringGaps.slice(0, 8)} maxCount={strongestGapCount} tone="gap" />
          ) : (
            <EmptyAnalytics
              title="No saved match gaps yet."
              text="Generate match reports on application detail pages to see recurring gaps."
            />
          )}
        </div>
      </section>
    </main>
  );
}

function Metric({
  label,
  value,
  icon
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3 text-[var(--muted)]">
        <span className="text-sm font-medium">{label}</span>
        {icon}
      </div>
      <div className="mt-3 text-3xl font-semibold">{value}</div>
    </div>
  );
}

function DistributionRow({
  label,
  count,
  maxCount
}: {
  label: string;
  count: number;
  maxCount: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium capitalize">{label}</span>
        <span className="font-semibold">{count}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100">
        <div
          className="h-full rounded-full bg-teal-700"
          style={{ width: `${Math.max((count / maxCount) * 100, 8)}%` }}
        />
      </div>
    </div>
  );
}

function RankedList({
  items,
  maxCount,
  tone
}: {
  items: Array<{ skill: string; count: number }>;
  maxCount: number;
  tone: "skill" | "gap";
}) {
  const barClassName = tone === "gap" ? "bg-amber-500" : "bg-teal-700";

  return (
    <div className="mt-5 space-y-3">
      {items.map((item) => (
        <div key={item.skill} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{item.skill}</div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-stone-100">
              <div
                className={`h-full rounded-full ${barClassName}`}
                style={{ width: `${Math.max((item.count / maxCount) * 100, 12)}%` }}
              />
            </div>
          </div>
          <span className="rounded-md border border-[var(--line)] px-2 py-1 text-sm font-semibold">
            {item.count}
          </span>
        </div>
      ))}
    </div>
  );
}

function Signal({ label, value, note }: { label: string; value: number; note: string }) {
  return (
    <div className="rounded-md border border-[var(--line)] p-4">
      <div className="text-sm font-medium text-[var(--muted)]">{label}</div>
      <div className="mt-2 text-3xl font-semibold">{value}</div>
      <p className="mt-2 text-sm text-[var(--muted)]">{note}</p>
    </div>
  );
}

function EmptyAnalytics({ title, text }: { title: string; text: string }) {
  return (
    <div className="mt-5 rounded-md border border-dashed border-[var(--line)] px-4 py-5">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-[var(--muted)]">{text}</p>
    </div>
  );
}
