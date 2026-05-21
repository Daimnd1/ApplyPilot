import { z } from "zod";

export const savedMatchReportSchema = z.object({
  id: z.string().uuid(),
  applicationId: z.string().uuid(),
  matchedSkills: z.array(z.string()).default([]),
  missingSkills: z.array(z.string()).default([]),
  score: z.number().int().min(0).max(100),
  recommendations: z.array(z.string()).default([]),
  createdAt: z.string()
});

export const matchReportApplicationSchema = z.object({
  applicationId: z.string().uuid("Invalid application id.")
});

export type SavedMatchReport = z.infer<typeof savedMatchReportSchema>;

export function mapSavedMatchReportRow(row: Record<string, unknown>): SavedMatchReport {
  return savedMatchReportSchema.parse({
    id: row.id,
    applicationId: row.application_id,
    matchedSkills: row.matched_skills ?? [],
    missingSkills: row.missing_skills ?? [],
    score: row.score,
    recommendations: row.recommendations ?? [],
    createdAt: row.created_at
  });
}
