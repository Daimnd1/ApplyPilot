import { z } from "zod";
import { APPLICATION_STATUSES } from "./application-status";

export const workModeSchema = z.enum(["remote", "hybrid", "on-site", "unknown"]);

const optionalUrlSchema = z
  .string()
  .trim()
  .transform((value) => (value === "" ? undefined : value))
  .pipe(z.string().url("Enter a valid URL.").optional());

const optionalDateSchema = z
  .string()
  .trim()
  .transform((value) => (value === "" ? undefined : value))
  .pipe(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date.").optional());

export const applicationSchema = z.object({
  id: z.string().uuid(),
  company: z.string().min(1, "Company is required"),
  roleTitle: z.string().min(1, "Role title is required"),
  location: z.string().optional(),
  workMode: workModeSchema.default("unknown"),
  jobUrl: z.string().url().optional(),
  status: z.enum(APPLICATION_STATUSES),
  deadline: z.string().optional(),
  notes: z.string().optional(),
  contactName: z.string().optional(),
  salary: z.string().optional(),
  skills: z.array(z.string()).default([]),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type Application = z.infer<typeof applicationSchema>;

export const createApplicationSchema = z.object({
  company: z.string().trim().min(1, "Company is required."),
  roleTitle: z.string().trim().min(1, "Role title is required."),
  location: z.string().trim().optional(),
  workMode: workModeSchema.default("unknown"),
  jobUrl: optionalUrlSchema,
  status: z.enum(APPLICATION_STATUSES).default("wishlist"),
  deadline: optionalDateSchema,
  notes: z.string().trim().optional(),
  contactName: z.string().trim().optional(),
  salary: z.string().trim().optional(),
  jobDescription: z.string().trim().optional()
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export const updateApplicationSchema = createApplicationSchema.extend({
  id: z.string().uuid("Invalid application id.")
});

export const deleteApplicationSchema = z.object({
  id: z.string().uuid("Invalid application id.")
});

export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;

export type ApplicationFormFieldErrors = Partial<
  Record<keyof UpdateApplicationInput, string[]>
>;

export function mapApplicationRow(row: Record<string, unknown>): Application {
  return applicationSchema.parse({
    id: row.id,
    company: row.company,
    roleTitle: row.role_title,
    location: row.location ?? undefined,
    workMode: row.work_mode,
    jobUrl: row.job_url ?? undefined,
    status: row.status,
    deadline: row.deadline ?? undefined,
    notes: row.notes ?? undefined,
    contactName: row.contact_name ?? undefined,
    salary: row.salary ?? undefined,
    skills: row.skills ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at
  });
}
