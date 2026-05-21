import { z } from "zod";

const urlOrEmptySchema = z
  .string()
  .trim()
  .transform((value) => (value === "" ? undefined : value))
  .pipe(z.string().url("Enter a valid URL.").optional());

export const candidateProfileSchema = z.object({
  id: z.string().uuid().optional(),
  headline: z.string().min(3, "Headline must be at least 3 characters."),
  summary: z.string().optional(),
  skills: z.array(z.string()).default([]),
  projectBullets: z.array(z.string()).default([]),
  education: z.string().optional(),
  languages: z.array(z.string()).default([]),
  links: z.array(
    z.object({
      label: z.string(),
      url: z.string().url()
    })
  ),
  preferredRoles: z.array(z.string()).default([])
});

export type CandidateProfile = z.infer<typeof candidateProfileSchema>;

export const candidateProfileFormSchema = z.object({
  headline: z.string().trim().min(3, "Headline must be at least 3 characters."),
  summary: z.string().trim().optional(),
  skills: z.string().trim().optional(),
  projectBullets: z.string().trim().optional(),
  education: z.string().trim().optional(),
  languages: z.string().trim().optional(),
  preferredRoles: z.string().trim().optional(),
  githubUrl: urlOrEmptySchema,
  linkedinUrl: urlOrEmptySchema,
  portfolioUrl: urlOrEmptySchema
});

export type CandidateProfileFormInput = z.infer<typeof candidateProfileFormSchema>;
export type CandidateProfileFieldErrors = Partial<
  Record<keyof CandidateProfileFormInput, string[]>
>;

export function splitLines(value?: string) {
  return (value ?? "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function joinLines(values: string[]) {
  return values.join("\n");
}

export function buildLinks(input: CandidateProfileFormInput) {
  return [
    input.githubUrl ? { label: "GitHub", url: input.githubUrl } : null,
    input.linkedinUrl ? { label: "LinkedIn", url: input.linkedinUrl } : null,
    input.portfolioUrl ? { label: "Portfolio", url: input.portfolioUrl } : null
  ].filter((link): link is { label: string; url: string } => Boolean(link));
}

export function getLinkUrl(profile: CandidateProfile | null, label: string) {
  return profile?.links.find((link) => link.label.toLowerCase() === label.toLowerCase())?.url ?? "";
}

export function mapCandidateProfileRow(row: Record<string, unknown>): CandidateProfile {
  return candidateProfileSchema.parse({
    id: row.id,
    headline: row.headline,
    summary: row.summary ?? undefined,
    skills: row.skills ?? [],
    projectBullets: row.project_bullets ?? [],
    education: row.education ?? undefined,
    languages: row.languages ?? [],
    links: row.links ?? [],
    preferredRoles: row.preferred_roles ?? []
  });
}
