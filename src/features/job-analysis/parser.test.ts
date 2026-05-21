import { describe, expect, it } from "vitest";
import { matchCandidateToJob } from "./match";
import { parseJobDescription } from "./parser";

describe("parseJobDescription", () => {
  it("extracts skills, seniority, language requirements, and responsibilities", () => {
    const result = parseJobDescription(
      "Junior developer role. Build accessible React and TypeScript UI with Next.js, PostgreSQL, and Playwright. English required."
    );

    expect(result.seniorityLevel).toBe("junior");
    expect(result.extractedSkills).toEqual(
      expect.arrayContaining(["React", "TypeScript", "Next.js", "PostgreSQL", "Testing"])
    );
    expect(result.languageRequirements).toContain("English");
    expect(result.responsibilities[0]).toContain("Build accessible React");
  });
});

describe("matchCandidateToJob", () => {
  it("scores matched and missing skills", () => {
    const job = parseJobDescription("React, TypeScript, Docker, PostgreSQL, and CI/CD.");
    const report = matchCandidateToJob(
      {
        skills: ["React", "TypeScript", "PostgreSQL"]
      },
      job
    );

    expect(report.matchedSkills).toEqual(expect.arrayContaining(["React", "TypeScript"]));
    expect(report.missingSkills).toEqual(expect.arrayContaining(["Docker", "CI/CD"]));
    expect(report.score).toBe(60);
  });
});
