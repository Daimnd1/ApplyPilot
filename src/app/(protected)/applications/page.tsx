import Link from "next/link";
import type { Route } from "next";
import { ExternalLink, Search } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { listApplicationsForCurrentUser } from "@/features/applications/queries";

export default async function ApplicationsPage() {
  const result = await listApplicationsForCurrentUser();
  const applications = result.ok ? result.applications : [];

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Applications</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Track saved jobs and their application status.</p>
        </div>
        <Link href="/applications/new" className={buttonStyles}>
          New application
        </Link>
      </div>

      <label className="flex min-h-11 items-center gap-2 rounded-md border border-[var(--line)] bg-white px-3 text-sm shadow-sm">
        <Search size={18} className="text-[var(--muted)]" />
        <input className="min-w-0 flex-1 outline-none" placeholder="Search company, role, skill, or location" />
      </label>

      {!result.ok ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {result.error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-lg border border-[var(--line)] bg-white shadow-sm">
        <div className="grid grid-cols-[1.1fr_1fr_0.7fr_0.7fr_0.4fr] border-b border-[var(--line)] px-4 py-3 text-sm font-semibold text-[var(--muted)]">
          <span>Company</span>
          <span>Role</span>
          <span>Status</span>
          <span>Deadline</span>
          <span>View</span>
        </div>
        {applications.length > 0 ? (
          applications.map((application) => (
            <div
              key={application.id}
              className="grid grid-cols-[1.1fr_1fr_0.7fr_0.7fr_0.4fr] items-center gap-3 border-b border-[var(--line)] px-4 py-4 text-sm last:border-b-0"
            >
              <div>
                <div className="font-medium">{application.company}</div>
                {application.jobUrl ? (
                  <a
                    href={application.jobUrl}
                    className="mt-1 inline-flex items-center gap-1 text-xs text-teal-800"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Job post <ExternalLink size={12} />
                  </a>
                ) : null}
              </div>
              <span>{application.roleTitle}</span>
              <span className="w-fit rounded-full bg-stone-100 px-3 py-1 capitalize">
                {application.status.replace("-", " ")}
              </span>
              <span>{application.deadline ?? "Open"}</span>
              <Link href={`/applications/${application.id}` as Route} className="font-medium text-teal-800">
                Open
              </Link>
            </div>
          ))
        ) : (
          <div className="px-4 py-10 text-center">
            <h2 className="text-base font-semibold">No applications yet</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Create the first application to start tracking.</p>
            <Link href="/applications/new" className={`${buttonStyles} mt-4`}>
              New application
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
