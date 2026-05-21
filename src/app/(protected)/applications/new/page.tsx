import { ApplicationForm } from "@/features/applications/application-form";

export default function NewApplicationPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">New Application</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Save a role and optionally parse the pasted job description.</p>
      </div>

      <ApplicationForm />
    </main>
  );
}
