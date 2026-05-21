const profile = {
  headline: "Software student focused on frontend and full-stack product work",
  skills: ["TypeScript", "React", "Next.js", "PostgreSQL", "Tailwind CSS"],
  languages: ["English", "Romanian", "Danish basics"],
  links: ["GitHub", "LinkedIn", "Portfolio"]
};

export default function ProfilePage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold">Candidate Profile</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Structured profile data for matching and interview prep.</p>
      </div>

      <section className="rounded-lg border border-[var(--line)] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">{profile.headline}</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <ProfileGroup title="Skills" values={profile.skills} />
          <ProfileGroup title="Languages" values={profile.languages} />
          <ProfileGroup title="Links" values={profile.links} />
        </div>
      </section>
    </main>
  );
}

function ProfileGroup({ title, values }: { title: string; values: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-[var(--muted)]">{title}</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.map((value) => (
          <span key={value} className="rounded-full border border-[var(--line)] bg-stone-50 px-3 py-1 text-sm">
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}
