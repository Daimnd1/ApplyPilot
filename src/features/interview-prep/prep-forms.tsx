"use client";

import { NotebookPen, Save, WandSparkles } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  generateInterviewPrepAction,
  saveInterviewPrepNotesAction,
  type InterviewPrepActionState
} from "./prep-actions";

const initialState: InterviewPrepActionState = {};

export function InterviewPrepGenerateForm({
  applicationId,
  disabledReason,
  hasPrep
}: {
  applicationId: string;
  disabledReason?: string;
  hasPrep: boolean;
}) {
  const [state, formAction] = useActionState(generateInterviewPrepAction, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="applicationId" value={applicationId} />
      <PrepGenerateButton disabled={Boolean(disabledReason)} hasPrep={hasPrep} />
      {disabledReason ? <p className="text-sm text-[var(--muted)]">{disabledReason}</p> : null}
      <ActionMessages state={state} />
    </form>
  );
}

export function InterviewPrepNotesForm({
  applicationId,
  notes
}: {
  applicationId: string;
  notes: string;
}) {
  const [state, formAction] = useActionState(saveInterviewPrepNotesAction, initialState);

  return (
    <form action={formAction} className="mt-5 space-y-3 border-t border-[var(--line)] pt-4">
      <input type="hidden" name="applicationId" value={applicationId} />
      <label className="block">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)]">
          <NotebookPen size={16} />
          Preparation notes
        </span>
        <textarea
          name="notes"
          defaultValue={notes}
          placeholder="Draft answers, examples to mention, questions to revisit."
          aria-invalid={Boolean(state.fieldErrors?.notes?.[0])}
          className="mt-2 min-h-32 w-full rounded-md border border-[var(--line)] px-3 py-2 text-sm outline-none focus:border-teal-700"
        />
      </label>
      {state.fieldErrors?.notes?.[0] ? (
        <p className="text-sm text-red-700">{state.fieldErrors.notes[0]}</p>
      ) : null}
      <ActionMessages state={state} />
      <div className="flex justify-end">
        <PrepNotesButton />
      </div>
    </form>
  );
}

function PrepGenerateButton({ disabled, hasPrep }: { disabled: boolean; hasPrep: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={disabled || pending}>
      <WandSparkles size={18} />
      {pending ? "Generating..." : hasPrep ? "Regenerate prep" : "Generate prep"}
    </Button>
  );
}

function PrepNotesButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      <Save size={18} />
      {pending ? "Saving..." : "Save notes"}
    </Button>
  );
}

function ActionMessages({ state }: { state: InterviewPrepActionState }) {
  return (
    <>
      {state.error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="rounded-md border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-900">{state.success}</p>
      ) : null}
    </>
  );
}
