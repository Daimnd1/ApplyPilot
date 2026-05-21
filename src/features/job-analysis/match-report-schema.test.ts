import { describe, expect, it } from "vitest";
import { mapSavedMatchReportRow } from "./match-report-schema";

describe("mapSavedMatchReportRow", () => {
  it("maps persisted match reports into view models", () => {
    const report = mapSavedMatchReportRow({
      id: "11111111-1111-4111-8111-111111111111",
      application_id: "22222222-2222-4222-8222-222222222222",
      matched_skills: ["React", "TypeScript"],
      missing_skills: ["Docker"],
      score: 67,
      recommendations: ["Lead with React evidence."],
      created_at: "2026-05-21T10:00:00.000Z"
    });

    expect(report.applicationId).toBe("22222222-2222-4222-8222-222222222222");
    expect(report.matchedSkills).toEqual(["React", "TypeScript"]);
    expect(report.missingSkills).toEqual(["Docker"]);
  });
});
