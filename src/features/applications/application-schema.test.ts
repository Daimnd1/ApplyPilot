import { describe, expect, it } from "vitest";
import { createApplicationSchema, mapApplicationRow } from "./application-schema";

describe("createApplicationSchema", () => {
  it("validates required company and role fields", () => {
    const result = createApplicationSchema.safeParse({
      company: "",
      roleTitle: "",
      workMode: "unknown",
      status: "wishlist"
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.company).toContain("Company is required.");
      expect(errors.roleTitle).toContain("Role title is required.");
    }
  });

  it("normalizes empty optional URL and date fields", () => {
    const result = createApplicationSchema.parse({
      company: "Nordic Labs",
      roleTitle: "Junior Developer",
      workMode: "hybrid",
      status: "applied",
      jobUrl: "",
      deadline: ""
    });

    expect(result.jobUrl).toBeUndefined();
    expect(result.deadline).toBeUndefined();
  });
});

describe("mapApplicationRow", () => {
  it("maps Supabase snake_case rows into application view models", () => {
    const application = mapApplicationRow({
      id: "11111111-1111-4111-8111-111111111111",
      company: "Nordic Labs",
      role_title: "Junior Frontend Developer",
      location: "Copenhagen",
      work_mode: "hybrid",
      job_url: "https://example.com/job",
      status: "applied",
      deadline: "2026-06-01",
      notes: "Tailor React project.",
      contact_name: "Recruiter",
      skills: ["React", "TypeScript"],
      created_at: "2026-05-21T10:00:00.000Z",
      updated_at: "2026-05-21T10:00:00.000Z"
    });

    expect(application.roleTitle).toBe("Junior Frontend Developer");
    expect(application.workMode).toBe("hybrid");
    expect(application.skills).toEqual(["React", "TypeScript"]);
  });
});
