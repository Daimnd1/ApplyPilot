import { ProfileForm } from "@/features/candidate-profile/profile-form";
import { getCandidateProfileForCurrentUser } from "@/features/candidate-profile/queries";

export default async function ProfilePage() {
  const result = await getCandidateProfileForCurrentUser();
  const profile = result.ok ? result.profile : null;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold">Candidate Profile</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Structured profile data for matching and interview prep.</p>
      </div>

      {!result.ok ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {result.error}
        </div>
      ) : null}

      <ProfileSummary profile={profile} />
      <ProfileForm profile={profile} />
    </main>
  );
}

function ProfileSummary({
  profile
}: {
  profile:
    | {
        headline: string;
        skills: string[];
        languages: string[];
        links: Array<{ label: string; url: string }>;
      }
    | null;
}) {
  if (!profile) {
    return (
      <section className="rounded-lg border border-[var(--line)] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">No profile saved yet</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Add skills, project bullets, links, and role preferences before generating match reports.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-[var(--line)] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">{profile.headline}</h2>
      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <ProfileGroup title="Skills" values={profile.skills} />
        <ProfileGroup title="Languages" values={profile.languages} />
        <ProfileGroup title="Links" values={profile.links.map((link) => link.label)} />
      </div>
    </section>
  );
}

function ProfileGroup({ title, values }: { title: string; values: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-[var(--muted)]">{title}</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.length > 0 ? (
          values.map((value) => (
            <span key={value} className="rounded-full border border-[var(--line)] bg-stone-50 px-3 py-1 text-sm">
              {value}
            </span>
          ))
        ) : (
          <span className="text-sm text-[var(--muted)]">Not set</span>
        )}
      </div>
    </div>
  );
}
