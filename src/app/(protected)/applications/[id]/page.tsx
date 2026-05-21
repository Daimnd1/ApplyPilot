import { notFound } from "next/navigation";
import Link from "next/link";
import type { Route } from "next";
import { CalendarDays, ExternalLink, MapPin, Pencil, Trash2 } from "lucide-react";
import { deleteApplicationAction } from "@/features/applications/actions";
import { getApplicationDetailsForCurrentUser } from "@/features/applications/queries";
import { buttonStyles } from "@/components/ui/button";

export default async function ApplicationDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getApplicationDetailsForCurrentUser(id);

  if (!result.ok) {
    if (result.notFound) {
      notFound();
    }

    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {result.error}
        </div>
      </main>
    );
  }

  const { application, jobDescription } = result;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--muted)]">{application.company}</p>
          <h1 className="mt-1 text-2xl font-semibold">{application.roleTitle}</h1>
          <div className="mt-3 flex flex-wrap gap-2 text-sm text-[var(--muted)]">
            {application.location ? (
              <span className="inline-flex items-center gap-1">
                <MapPin size={16} />
                {application.location}
              </span>
            ) : null}
            {application.deadline ? (
              <span className="inline-flex items-center gap-1">
                <CalendarDays size={16} />
                {application.deadline}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href={`/applications/${application.id}/edit` as Route} className={buttonStyles}>
            <Pencil size={18} />
            Edit
          </Link>
          <form action={deleteApplicationAction}>
            <input type="hidden" name="id" value={application.id} />
            <button
              type="submit"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-50"
            >
              <Trash2 size={18} />
              Delete
            </button>
          </form>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Info label="Status" value={application.status.replace("-", " ")} />
        <Info label="Work mode" value={application.workMode.replace("-", " ")} />
        <Info label="Salary" value={application.salary || "Not set"} />
      </section>

      <section className="rounded-lg border border-[var(--line)] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Application Notes</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm text-stone-700">
          {application.notes || "No notes yet."}
        </p>
        {application.jobUrl ? (
          <a
            href={application.jobUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal-800"
          >
            Open job post <ExternalLink size={14} />
          </a>
        ) : null}
      </section>

      <section className="rounded-lg border border-[var(--line)] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Job Analysis</h2>
        {jobDescription ? (
          <div className="mt-4 space-y-5">
            <SkillGroup title="Extracted skills" values={jobDescription.extractedSkills} />
            <SkillGroup title="Keywords" values={jobDescription.keywords} />
            <TextList title="Responsibilities" values={jobDescription.responsibilities} />
          </div>
        ) : (
          <p className="mt-3 text-sm text-[var(--muted)]">No job description has been saved for this application.</p>
        )}
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--line)] bg-white p-4 shadow-sm">
      <div className="text-sm font-medium text-[var(--muted)]">{label}</div>
      <div className="mt-2 text-lg font-semibold capitalize">{value}</div>
    </div>
  );
}

function SkillGroup({ title, values }: { title: string; values: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-[var(--muted)]">{title}</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.length > 0 ? (
          values.map((value) => (
            <span key={value} className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm text-teal-900">
              {value}
            </span>
          ))
        ) : (
          <span className="text-sm text-[var(--muted)]">None detected.</span>
        )}
      </div>
    </div>
  );
}

function TextList({ title, values }: { title: string; values: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-[var(--muted)]">{title}</h3>
      {values.length > 0 ? (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-stone-700">
          {values.map((value) => (
            <li key={value}>{value}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-[var(--muted)]">None detected.</p>
      )}
    </div>
  );
}
