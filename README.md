# ApplyPilot

![CI](https://github.com/Daimnd1/ApplyPilot/actions/workflows/ci.yml/badge.svg)

ApplyPilot is a portfolio-grade full-stack app for software students and junior developers who want to make job searching measurable. It combines an application tracker with job-description parsing, CV/project matching, interview prep, and analytics.

## MVP Stack

- **App:** Next.js App Router, React, TypeScript
- **Styling:** Tailwind CSS with local shadcn-style UI primitives
- **Backend:** Next.js Server Actions and Route Handlers
- **Auth and data:** Supabase Auth and PostgreSQL with Row Level Security
- **Validation:** Zod
- **Testing:** Vitest for parser/match logic, Playwright for the core user journey
- **Deployment:** Vercel for the app, Supabase for auth/database

## First Slice

The MVP starts with one narrow vertical slice:

1. Auth-protected dashboard
2. Create one application
3. Paste a job description
4. Extract skills deterministically
5. Compare extracted skills with candidate profile data
6. Save and show the result on the application detail page

## Repository Structure

```txt
src/
  app/                         Next.js routes, layouts, route handlers, proxy
  components/                  Shared layout and UI primitives
  features/
    applications/              Application statuses, schema, seeded data
    candidate-profile/         Candidate profile schema
    dashboard/                 Analytics and metrics helpers
    job-analysis/              Parser, matching logic, unit tests
  lib/                         Environment, utilities, Supabase clients
supabase/
  migrations/                  PostgreSQL schema and RLS policies
tests/
  e2e/                         Playwright journeys
docs/                          Architecture and day-by-day build plan
```

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Create `.env.local` from `.env.example` when Supabase is configured.

## Quality Commands

```bash
npm run typecheck
npm run lint
npm run test
npm run test:e2e
```

## CI/CD

GitHub Actions runs the CI quality gate on pushes to `main` and pull requests:

- install dependencies with `npm ci`
- install Playwright Chromium
- run TypeScript checks
- run ESLint
- run Vitest
- run Playwright E2E against a production build

Deployment is intended to run through Vercel's Git integration. Configure the Vercel project with the same environment variables listed in `.env.example`, then connect the GitHub repository so pushes to `main` deploy automatically after CI passes.

## Current Status

- Day 1 and Day 2 are complete in code.
- The dashboard, application CRUD, application detail/edit views, candidate profile persistence, deterministic parser, matching logic, Supabase schema, Supabase auth shell, protected route redirects, Vitest tests, and Playwright auth-guard tests are in place.
- Saved match reports are the next implementation target.

## Portfolio Framing

**CV bullet:** Built ApplyPilot, a full-stack job application platform with authentication, job tracking, CV/job-description matching, interview preparation, analytics dashboards, automated tests, and production deployment.

**Interview story:** I built ApplyPilot around my own job-search workflow. The product turns applications from scattered notes into measurable data: tracked applications, parsed job descriptions, skill-gap analysis, tailored preparation, and response-rate analytics.
