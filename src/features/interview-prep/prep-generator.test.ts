import { describe, expect, it } from "vitest";
import { generateInterviewPrep } from "./prep-generator";

describe("generateInterviewPrep", () => {
  it("builds saved-question groups from role and job analysis data", () => {
    const prep = generateInterviewPrep({
      company: "ApplyPilot",
      roleTitle: "Frontend Developer",
      extractedSkills: ["React", "TypeScript"],
      responsibilities: ["Build accessible interfaces."]
    });

    expect(prep.technicalQuestions).toEqual(
      expect.arrayContaining([
        "Describe a project where you used React. What tradeoffs did you make?",
        "How would you approach this part of the role: Build accessible interfaces?"
      ])
    );
    expect(prep.behavioralQuestions[0]).toContain("Frontend Developer");
    expect(prep.companyQuestions[0]).toContain("ApplyPilot");
  });
});
