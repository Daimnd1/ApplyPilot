"use client";

import { Save } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  createApplicationAction,
  updateApplicationAction,
  type ApplicationActionState
} from "./actions";
import type { Application } from "./application-schema";
import { APPLICATION_STATUSES } from "./application-status";
import { Button } from "@/components/ui/button";

const workModes = ["unknown", "remote", "hybrid", "on-site"] as const;
const initialState: ApplicationActionState = {};

export function ApplicationForm({
  application,
  jobDescriptionText
}: {
  application?: Application;
  jobDescriptionText?: string;
}) {
  const action = application ? updateApplicationAction : createApplicationAction;
  const [state, formAction] = useActionState(
    action,
    initialState
  );

  return (
    <form action={formAction} className="space-y-5 rounded-lg border border-[var(--line)] bg-white p-5 shadow-sm">
      {application ? <input type="hidden" name="id" value={application.id} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Company"
          name="company"
          placeholder="Company name"
          defaultValue={application?.company}
          error={state.fieldErrors?.company?.[0]}
        />
        <Field
          label="Role title"
          name="roleTitle"
          placeholder="Junior frontend developer"
          defaultValue={application?.roleTitle}
          error={state.fieldErrors?.roleTitle?.[0]}
        />
        <Field label="Location" name="location" placeholder="Copenhagen, Denmark" defaultValue={application?.location} />
        <Field
          label="Deadline"
          name="deadline"
          type="date"
          defaultValue={application?.deadline}
          error={state.fieldErrors?.deadline?.[0]}
        />
        <Field
          label="Job URL"
          name="jobUrl"
          type="url"
          placeholder="https://..."
          defaultValue={application?.jobUrl}
          error={state.fieldErrors?.jobUrl?.[0]}
        />
        <Field
          label="Contact"
          name="contactName"
          placeholder="Recruiter or hiring manager"
          defaultValue={application?.contactName}
        />
        <Field label="Salary" name="salary" placeholder="Optional salary range" defaultValue={application?.salary} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Status" name="status" values={APPLICATION_STATUSES} defaultValue={application?.status} />
        <SelectField label="Work mode" name="workMode" values={workModes} defaultValue={application?.workMode} />
      </div>

      <label className="block">
        <span className="text-sm font-medium">Notes</span>
        <textarea
          name="notes"
          className="mt-2 min-h-24 w-full rounded-md border border-[var(--line)] px-3 py-2 outline-none focus:border-teal-700"
          placeholder="Application notes, tailoring ideas, contact history"
          defaultValue={application?.notes}
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Job description</span>
        <textarea
          name="jobDescription"
          className="mt-2 min-h-40 w-full rounded-md border border-[var(--line)] px-3 py-2 outline-none focus:border-teal-700"
          placeholder="Paste the job post text"
          defaultValue={jobDescriptionText}
        />
      </label>

      {state.error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>
      ) : null}

      <div className="flex justify-end">
        <SubmitButton label={application ? "Update application" : "Save application"} pendingLabel={application ? "Updating..." : "Saving..."} />
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
  defaultValue,
  error
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
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

function SelectField<TValue extends string>({
  label,
  name,
  values,
  defaultValue
}: {
  label: string;
  name: string;
  values: readonly TValue[];
  defaultValue?: TValue;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="mt-2 min-h-11 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 capitalize outline-none focus:border-teal-700"
      >
        {values.map((value) => (
          <option key={value} value={value}>
            {value.replace("-", " ")}
          </option>
        ))}
      </select>
    </label>
  );
}

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      <Save size={18} />
      {pending ? pendingLabel : label}
    </Button>
  );
}
