"use client";

import { WandSparkles } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  generateMatchReportAction,
  type MatchReportActionState
} from "./match-report-actions";

const initialState: MatchReportActionState = {};

export function MatchReportForm({
  applicationId,
  disabledReason
}: {
  applicationId: string;
  disabledReason?: string;
}) {
  const [state, formAction] = useActionState(generateMatchReportAction, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="applicationId" value={applicationId} />
      <GenerateButton disabled={Boolean(disabledReason)} />
      {disabledReason ? <p className="text-sm text-[var(--muted)]">{disabledReason}</p> : null}
      {state.error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="rounded-md border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-900">{state.success}</p>
      ) : null}
    </form>
  );
}

function GenerateButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={disabled || pending}>
      <WandSparkles size={18} />
      {pending ? "Generating..." : "Generate match report"}
    </Button>
  );
}
