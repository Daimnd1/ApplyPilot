"use client";

import { UserPlus } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { signUpAction, type AuthActionState } from "./actions";

const initialState: AuthActionState = {};

export function SignupForm() {
  const [state, formAction] = useActionState(signUpAction, initialState);

  return (
    <form action={formAction} className="w-full max-w-md rounded-lg border border-[var(--line)] bg-white p-6 shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold">Create account</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Use Supabase Auth to keep application data private.</p>
      </div>

      <div className="mt-6 space-y-4">
        <Field
          label="Name"
          name="name"
          type="text"
          autoComplete="name"
          error={state.fieldErrors?.name?.[0]}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          error={state.fieldErrors?.email?.[0]}
        />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          error={state.fieldErrors?.password?.[0]}
        />
      </div>

      {state.error ? (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>
      ) : null}

      {state.success ? (
        <p className="mt-4 rounded-md border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-900">
          {state.success}
        </p>
      ) : null}

      <SubmitButton label="Create account" />
    </form>
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
  error
}: {
  label: string;
  name: string;
  type: string;
  autoComplete: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
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

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="mt-6 w-full justify-center" disabled={pending}>
      <UserPlus size={18} />
      {pending ? "Creating account..." : label}
    </Button>
  );
}
