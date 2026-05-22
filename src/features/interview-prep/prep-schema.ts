import { z } from "zod";

export const interviewPrepApplicationSchema = z.object({
  applicationId: z.string().uuid("Invalid application id.")
});

export const interviewPrepNotesSchema = interviewPrepApplicationSchema.extend({
  notes: z.string().trim().max(8000, "Notes must be 8000 characters or fewer.")
});

export const savedInterviewPrepSchema = z.object({
  id: z.string().uuid(),
  applicationId: z.string().uuid(),
  technicalQuestions: z.array(z.string()).default([]),
  behavioralQuestions: z.array(z.string()).default([]),
  companyQuestions: z.array(z.string()).default([]),
  notes: z.string().default(""),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type SavedInterviewPrep = z.infer<typeof savedInterviewPrepSchema>;

export function mapSavedInterviewPrepRow(row: Record<string, unknown>): SavedInterviewPrep {
  return savedInterviewPrepSchema.parse({
    id: row.id,
    applicationId: row.application_id,
    technicalQuestions: row.technical_questions ?? [],
    behavioralQuestions: row.behavioral_questions ?? [],
    companyQuestions: row.company_questions ?? [],
    notes: row.notes ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at
  });
}
