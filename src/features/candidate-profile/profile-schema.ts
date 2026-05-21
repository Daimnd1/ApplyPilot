import { z } from "zod";

export const candidateProfileSchema = z.object({
  id: z.string().uuid().optional(),
  headline: z.string().min(3),
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
