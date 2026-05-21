import { notFound } from "next/navigation";
import { ApplicationForm } from "@/features/applications/application-form";
import { getApplicationDetailsForCurrentUser } from "@/features/applications/queries";

export default async function EditApplicationPage({
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
      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {result.error}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Edit Application</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Update tracking details and refresh parsed job-description data.
        </p>
      </div>

      <ApplicationForm
        application={result.application}
        jobDescriptionText={result.jobDescription?.rawText}
      />
    </main>
  );
}
