import { describe, expect, it } from "vitest";
import type { Application } from "@/features/applications/application-schema";
import { buildDashboardMetrics } from "./metrics";

const application = (overrides: Partial<Application>): Application => ({
  id: "11111111-1111-4111-8111-111111111111",
  company: "ApplyPilot",
  roleTitle: "Developer",
  workMode: "hybrid",
  status: "applied",
  skills: [],
  createdAt: "2026-05-20T10:00:00.000Z",
  updatedAt: "2026-05-20T10:00:00.000Z",
  ...overrides
});

describe("buildDashboardMetrics", () => {
  it("derives response rate, statuses, frequent skills, and latest report gaps", () => {
    const metrics = buildDashboardMetrics(
      [
        application({ skills: ["React", "TypeScript"] }),
        application({
          id: "22222222-2222-4222-8222-222222222222",
          status: "interviewing",
          skills: ["React", "Testing"]
        }),
        application({
          id: "33333333-3333-4333-8333-333333333333",
          status: "rejected",
          skills: ["PostgreSQL"]
        })
      ],
      [
        {
          applicationId: "11111111-1111-4111-8111-111111111111",
          missingSkills: ["Docker", "Testing"],
          createdAt: "2026-05-20T10:00:00.000Z"
        },
        {
          applicationId: "11111111-1111-4111-8111-111111111111",
          missingSkills: ["Docker"],
          createdAt: "2026-05-21T10:00:00.000Z"
        },
        {
          applicationId: "22222222-2222-4222-8222-222222222222",
          missingSkills: ["Docker", "CI/CD"],
          createdAt: "2026-05-21T11:00:00.000Z"
        }
      ]
    );

    expect(metrics.responseRate).toBe(67);
    expect(metrics.interviewCount).toBe(1);
    expect(metrics.frequentSkills[0]).toEqual({ skill: "React", count: 2 });
    expect(metrics.recurringGaps[0]).toEqual({ skill: "Docker", count: 2 });
    expect(metrics.recurringGaps).not.toContainEqual({ skill: "Testing", count: 1 });
  });
});
