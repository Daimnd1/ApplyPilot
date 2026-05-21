"use client";

import { Save } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { saveCandidateProfileAction, type CandidateProfileActionState } from "./actions";
import type { CandidateProfile } from "./profile-schema";
import { getLinkUrl, joinLines } from "./profile-schema";

const initialState: CandidateProfileActionState = {};

export function ProfileForm({ profile }: { profile: CandidateProfile | null }) {
  const [state, formAction] = useActionState(saveCandidateProfileAction, initialState);

  return (
    <form action={formAction} className="space-y-5 rounded-lg border border-[var(--line)] bg-white p-5 shadow-sm">
      <Field
        label="Headline"
        name="headline"
        placeholder="Software student focused on full-stack product work"
        defaultValue={profile?.headline}
        error={state.fieldErrors?.headline?.[0]}
      />

      <TextArea
        label="Summary"
        name="summary"
        placeholder="Short profile summary for matching and interview prep"
        defaultValue={profile?.summary}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextArea
          label="Skills"
          name="skills"
          placeholder="TypeScript&#10;React&#10;PostgreSQL"
          defaultValue={joinLines(profile?.skills ?? [])}
        />
        <TextArea
          label="Preferred roles"
          name="preferredRoles"
          placeholder="Junior Frontend Developer&#10;Student Software Engineer"
          defaultValue={joinLines(profile?.preferredRoles ?? [])}
        />
      </div>

      <TextArea
        label="Project bullets"
        name="projectBullets"
        placeholder="Built a full-stack tracker with auth, RLS, tests, and deployment"
        defaultValue={joinLines(profile?.projectBullets ?? [])}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextArea
          label="Education"
          name="education"
          placeholder="Software development program, school, dates"
          defaultValue={profile?.education}
        />
        <TextArea
          label="Languages"
          name="languages"
          placeholder="English&#10;Danish basics"
          defaultValue={joinLines(profile?.languages ?? [])}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field
          label="GitHub URL"
          name="githubUrl"
          type="url"
          placeholder="https://github.com/..."
          defaultValue={getLinkUrl(profile, "GitHub")}
          error={state.fieldErrors?.githubUrl?.[0]}
        />
        <Field
          label="LinkedIn URL"
          name="linkedinUrl"
          type="url"
          placeholder="https://linkedin.com/in/..."
          defaultValue={getLinkUrl(profile, "LinkedIn")}
          error={state.fieldErrors?.linkedinUrl?.[0]}
        />
        <Field
          label="Portfolio URL"
          name="portfolioUrl"
          type="url"
          placeholder="https://..."
          defaultValue={getLinkUrl(profile, "Portfolio")}
          error={state.fieldErrors?.portfolioUrl?.[0]}
        />
      </div>

      {state.error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>
      ) : null}

      {state.success ? (
        <p className="rounded-md border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-900">{state.success}</p>
      ) : null}

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  defaultValue,
  error
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="mt-2 min-h-11 w-full rounded-md border border-[var(--line)] px-3 py-2 outline-none focus:border-teal-700"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error ? (
        <span id={`${name}-error`} className="mt-1 block text-sm text-red-700">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function TextArea({
  label,
  name,
  placeholder,
  defaultValue
}: {
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <textarea
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="mt-2 min-h-28 w-full rounded-md border border-[var(--line)] px-3 py-2 outline-none focus:border-teal-700"
      />
    </label>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      <Save size={18} />
      {pending ? "Saving..." : "Save profile"}
    </Button>
  );
}
