import { BriefcaseBusiness, ChartNoAxesCombined, CircleAlert, Target } from "lucide-react";
import Link from "next/link";
import { demoApplications } from "@/features/applications/mock-data";
import { buildDashboardMetrics } from "@/features/dashboard/metrics";
import { matchCandidateToJob } from "@/features/job-analysis/match";
import { parseJobDescription } from "@/features/job-analysis/parser";
import { buttonStyles } from "@/components/ui/button";

const demoProfile = {
  skills: ["TypeScript", "React", "Next.js", "PostgreSQL", "Tailwind CSS"],
  projectBullets: [
    "Built full-stack course projects with React, TypeScript, API routes, and relational data models."
  ]
};

const demoJobText =
  "Junior frontend developer role using React, TypeScript, Next.js, REST APIs, Tailwind CSS, and PostgreSQL. Responsibilities include building accessible UI, collaborating with designers, and testing user flows. English required.";

export default function DashboardPage() {
  const metrics = buildDashboardMetrics(demoApplications);
  const parsedJob = parseJobDescription(demoJobText);
  const match = matchCandidateToJob(demoProfile, parsedJob);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid gap-4 md:grid-cols-4">
        <Metric label="Applications" value={metrics.totalApplications} icon={<BriefcaseBusiness size={20} />} />
        <Metric label="Response rate" value={`${metrics.responseRate}%`} icon={<ChartNoAxesCombined size={20} />} />
        <Metric label="Interviews" value={metrics.interviewCount} icon={<Target size={20} />} />
        <Metric label="Recurring gaps" value={match.missingSkills.length} icon={<CircleAlert size={20} />} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5 shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[var(--line)] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Application Pipeline</h1>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Current MVP shell with seeded data, ready for Supabase-backed CRUD on Day 3.
              </p>
            </div>
            <Link href="/applications/new" className={buttonStyles}>
              New application
            </Link>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {metrics.statusDistribution.map((status) => (
              <div key={status.status} className="rounded-md border border-[var(--line)] p-4">
                <div className="text-sm font-medium capitalize">{status.status.replace("-", " ")}</div>
                <div className="mt-3 text-3xl font-semibold">{status.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">CV Match Snapshot</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">Deterministic parser baseline</p>
            </div>
            <div className="rounded-full bg-teal-700 px-3 py-1 text-sm font-semibold text-white">
              {match.score}%
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <SkillGroup title="Matched" skills={match.matchedSkills} tone="match" />
            <SkillGroup title="Missing" skills={match.missingSkills} tone="gap" />
          </div>
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

function SkillGroup({
  title,
  skills,
  tone
}: {
  title: string;
  skills: string[];
  tone: "match" | "gap";
}) {
  const className =
    tone === "match"
      ? "border-teal-200 bg-teal-50 text-teal-900"
      : "border-amber-200 bg-amber-50 text-amber-900";

  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span key={skill} className={`rounded-full border px-3 py-1 text-sm ${className}`}>
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
