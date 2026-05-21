import type { Application } from "./application-schema";

export const demoApplications: Application[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    company: "Nordic Labs",
    roleTitle: "Junior Frontend Developer",
    location: "Copenhagen",
    workMode: "hybrid",
    jobUrl: "https://example.com/nordic-labs-frontend",
    status: "interviewing",
    deadline: "2026-06-02",
    notes: "Prep React testing and accessibility examples.",
    contactName: "Hiring team",
    skills: ["React", "TypeScript", "Tailwind CSS", "Testing"],
    createdAt: "2026-05-14T10:00:00.000Z",
    updatedAt: "2026-05-20T10:00:00.000Z"
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    company: "CloudWorks",
    roleTitle: "Student Software Engineer",
    location: "Remote",
    workMode: "remote",
    jobUrl: "https://example.com/cloudworks-student-engineer",
    status: "applied",
    deadline: "2026-05-28",
    notes: "Mention API project and database schema work.",
    contactName: "",
    skills: ["Next.js", "PostgreSQL", "REST APIs"],
    createdAt: "2026-05-15T11:00:00.000Z",
    updatedAt: "2026-05-19T11:00:00.000Z"
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    company: "BrightByte",
    roleTitle: "Junior Full-Stack Developer",
    location: "Aarhus",
    workMode: "on-site",
    jobUrl: "https://example.com/brightbyte-fullstack",
    status: "wishlist",
    deadline: "2026-06-10",
    notes: "Needs stronger Docker and CI framing.",
    contactName: "",
    skills: ["React", "Node.js", "Docker", "CI/CD"],
    createdAt: "2026-05-18T09:00:00.000Z",
    updatedAt: "2026-05-20T12:00:00.000Z"
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    company: "DataHarbor",
    roleTitle: "Backend Intern",
    location: "Odense",
    workMode: "hybrid",
    jobUrl: "https://example.com/dataharbor-backend",
    status: "rejected",
    deadline: "2026-05-10",
    notes: "Rejected after screening. Skill gap: Python testing and SQL tuning.",
    contactName: "",
    skills: ["Python", "SQL", "Testing"],
    createdAt: "2026-05-01T09:00:00.000Z",
    updatedAt: "2026-05-13T12:00:00.000Z"
  }
];
