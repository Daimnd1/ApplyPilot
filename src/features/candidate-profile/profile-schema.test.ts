import { describe, expect, it } from "vitest";
import {
  buildLinks,
  candidateProfileFormSchema,
  getLinkUrl,
  mapCandidateProfileRow,
  splitLines
} from "./profile-schema";

describe("candidate profile helpers", () => {
  it("splits newline and comma separated values", () => {
    expect(splitLines("TypeScript\nReact, PostgreSQL")).toEqual([
      "TypeScript",
      "React",
      "PostgreSQL"
    ]);
  });

  it("normalizes empty optional links", () => {
    const parsed = candidateProfileFormSchema.parse({
      headline: "Full-stack software student",
      githubUrl: "",
      linkedinUrl: "",
      portfolioUrl: ""
    });

    expect(buildLinks(parsed)).toEqual([]);
  });

  it("maps Supabase rows into candidate profile models", () => {
    const profile = mapCandidateProfileRow({
      id: "11111111-1111-4111-8111-111111111111",
      headline: "Software student",
      summary: "Focused on product work.",
      skills: ["TypeScript"],
      project_bullets: ["Built ApplyPilot"],
      education: "Software development",
      languages: ["English"],
      links: [{ label: "GitHub", url: "https://github.com/example" }],
      preferred_roles: ["Junior Developer"]
    });

    expect(profile.projectBullets).toEqual(["Built ApplyPilot"]);
    expect(getLinkUrl(profile, "github")).toBe("https://github.com/example");
  });
});
