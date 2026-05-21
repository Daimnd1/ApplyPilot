# ApplyPilot Day-by-Day Plan

## Day 1: Scope, Stack, Repository

**Goal:** Create a credible foundation that can become a shipped MVP.

**Acceptance criteria:**

- Git repository initialized.
- Next.js/TypeScript/Tailwind structure exists.
- Feature folders reflect the product scope.
- README, environment template, architecture notes, Supabase migration, and test config exist.
- Deterministic parser and match logic have first unit tests.

## Day 2: Layout and Auth Shell

**Goal:** Make the app navigable and prepare real authentication.

**Acceptance criteria:**

- Login, signup, signout, and protected route behavior are wired to Supabase.
- Logged-out users are redirected from dashboard, applications, and profile routes.
- Auth forms show validation and error states.
- Playwright covers auth guard behavior.

## Day 3: Database and Application CRUD

**Goal:** Replace seeded applications with user-owned persisted data.

**Acceptance criteria:**

- Supabase migration is applied.
- Application create/read/update/delete services exist.
- Application form uses Zod validation.
- Users can only access their own applications.
- Unit or integration tests cover validation and ownership assumptions.

## Day 4: Tracker Views

**Goal:** Make application tracking useful.

**Acceptance criteria:**

- List, detail, and edit views exist.
- Status workflow works.
- Search, filter, sort, empty states, and loading states are implemented.
- Mobile layout remains usable.

## Day 5: Job Description Parser

**Goal:** Save structured insight from pasted job descriptions.

**Acceptance criteria:**

- Paste flow parses skills, responsibilities, seniority, languages, keywords, and interview topics.
- Raw text and structured output are saved separately.
- Parser tests cover common junior developer job posts.

## Day 6: Candidate Profile

**Goal:** Give the match engine real candidate data.

**Acceptance criteria:**

- Candidate profile CRUD exists.
- Skills, projects, education, languages, links, and preferred roles are editable.
- Empty state helps the user add the first useful profile data.

## Day 7: Match Report

**Goal:** Compare the candidate profile against a job post.

**Acceptance criteria:**

- Matched skills, missing skills, score, and recommendations are shown.
- Reports are saved per application.
- The app labels generated suggestions as advisory and editable.

## Day 8: Interview Prep

**Goal:** Turn analysis into preparation.

**Acceptance criteria:**

- Technical, behavioral, and company questions are generated from job data.
- Notes are editable and saved.
- The detail page connects application status, match report, and prep.

## Day 9: Dashboard Analytics

**Goal:** Show whether the job search is improving.

**Acceptance criteria:**

- Dashboard shows totals, response rate, status distribution, frequent skills, and recurring gaps.
- Charts are readable on desktop and mobile.
- Metrics are derived from user-owned data.

## Day 10: Test Coverage

**Goal:** Prove the core journey.

**Acceptance criteria:**

- Playwright covers signup/signin, create application, parse job post, view match report.
- Vitest covers parser, matching, dashboard metrics, and form validation.
- CI command runs typecheck, lint, unit tests, and E2E.

## Day 11: Product Polish

**Goal:** Make the app feel portfolio-grade.

**Acceptance criteria:**

- Responsive states are checked.
- Loading, error, and empty states are polished.
- Accessibility pass covers labels, focus states, keyboard navigation, and contrast.

## Day 12: Deployment

**Goal:** Ship a live demo.

**Acceptance criteria:**

- Supabase project is configured.
- Vercel deployment succeeds.
- Environment variables are documented.
- Production smoke test passes.

## Day 13: README and Screenshots

**Goal:** Package the work for reviewers.

**Acceptance criteria:**

- README includes problem, features, architecture, data model, setup, tests, limitations, and future work.
- Screenshots are added.
- Architecture diagram is included.

## Day 14: CV and Interview Prep

**Goal:** Make the project easy to talk about.

**Acceptance criteria:**

- CV bullet is final.
- 60-second interview explanation is written.
- Demo flow and talking points are documented.
