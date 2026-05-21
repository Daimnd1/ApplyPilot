export type SeniorityLevel = "internship" | "junior" | "mid" | "senior" | "unknown";

export type ParsedJobDescription = {
  extractedSkills: string[];
  responsibilities: string[];
  keywords: string[];
  seniorityLevel: SeniorityLevel;
  languageRequirements: string[];
  interviewTopics: string[];
};

const skillCatalog = [
  ["TypeScript", "typescript", "ts"],
  ["JavaScript", "javascript", "js"],
  ["React", "react"],
  ["Next.js", "next.js", "nextjs"],
  ["Node.js", "node.js", "nodejs"],
  ["Python", "python"],
  ["FastAPI", "fastapi"],
  ["PostgreSQL", "postgresql", "postgres", "sql"],
  ["Supabase", "supabase"],
  ["Tailwind CSS", "tailwind", "tailwind css"],
  ["Testing", "test", "testing", "vitest", "playwright", "jest"],
  ["Docker", "docker"],
  ["CI/CD", "ci/cd", "github actions", "continuous integration"],
  ["REST APIs", "rest", "api", "apis", "http"],
  ["Accessibility", "accessibility", "a11y", "wcag"],
  ["Git", "git", "github"]
] as const;

const responsibilitySignals = [
  "build",
  "develop",
  "implement",
  "maintain",
  "collaborate",
  "test",
  "debug",
  "design",
  "ship",
  "improve"
];

const stopWords = new Set([
  "and",
  "the",
  "with",
  "for",
  "you",
  "our",
  "will",
  "are",
  "this",
  "that",
  "from",
  "your",
  "have",
  "role",
  "team",
  "work",
  "using",
  "include",
  "includes"
]);

export function parseJobDescription(rawText: string): ParsedJobDescription {
  const normalizedText = rawText.toLowerCase();
  const extractedSkills = skillCatalog
    .filter(([, ...aliases]) => aliases.some((alias) => hasTerm(normalizedText, alias)))
    .map(([skill]) => skill);

  return {
    extractedSkills,
    responsibilities: extractResponsibilities(rawText),
    keywords: extractKeywords(normalizedText, extractedSkills),
    seniorityLevel: detectSeniority(normalizedText),
    languageRequirements: detectLanguages(normalizedText),
    interviewTopics: buildInterviewTopics(extractedSkills)
  };
}

function extractResponsibilities(rawText: string) {
  return rawText
    .replace(/\s+/g, " ")
    .split(/[.!?]\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) =>
      responsibilitySignals.some((signal) => hasTerm(sentence.toLowerCase(), signal))
    )
    .slice(0, 6);
}

function extractKeywords(normalizedText: string, extractedSkills: string[]) {
  const skillWords = new Set(
    extractedSkills.flatMap((skill) => skill.toLowerCase().split(/[\s./-]+/))
  );

  const counts = normalizedText
    .replace(/[^a-z0-9+#./\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .filter((word) => !stopWords.has(word))
    .filter((word) => !skillWords.has(word))
    .reduce<Record<string, number>>((accumulator, word) => {
      accumulator[word] = (accumulator[word] ?? 0) + 1;
      return accumulator;
    }, {});

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

function detectSeniority(normalizedText: string): SeniorityLevel {
  if (/\b(intern|internship|student)\b/.test(normalizedText)) {
    return "internship";
  }

  if (/\b(junior|graduate|entry[-\s]?level)\b/.test(normalizedText)) {
    return "junior";
  }

  if (/\b(senior|lead|principal|staff)\b/.test(normalizedText)) {
    return "senior";
  }

  if (/\b(mid|intermediate)\b/.test(normalizedText)) {
    return "mid";
  }

  return "unknown";
}

function detectLanguages(normalizedText: string) {
  return [
    ["English", "english"],
    ["Danish", "danish", "dansk"],
    ["German", "german", "deutsch"],
    ["Swedish", "swedish", "svenska"]
  ]
    .filter(([, ...aliases]) => aliases.some((alias) => hasTerm(normalizedText, alias)))
    .map(([language]) => language);
}

function buildInterviewTopics(extractedSkills: string[]) {
  return extractedSkills.slice(0, 6).map((skill) => `${skill} project tradeoffs`);
}

function hasTerm(text: string, term: string) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9+#])${escaped}([^a-z0-9+#]|$)`, "i").test(text);
}
