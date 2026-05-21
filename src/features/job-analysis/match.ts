import type { ParsedJobDescription } from "./parser";

export type CandidateSnapshot = {
  skills: string[];
  projectBullets?: string[];
};

export type MatchReport = {
  matchedSkills: string[];
  missingSkills: string[];
  score: number;
  recommendations: string[];
};

export function matchCandidateToJob(
  candidate: CandidateSnapshot,
  job: Pick<ParsedJobDescription, "extractedSkills">
): MatchReport {
  const candidateSkills = new Set(candidate.skills.map(normalizeSkill));

  const matchedSkills = job.extractedSkills.filter((skill) =>
    candidateSkills.has(normalizeSkill(skill))
  );

  const missingSkills = job.extractedSkills.filter(
    (skill) => !candidateSkills.has(normalizeSkill(skill))
  );

  const score =
    job.extractedSkills.length === 0
      ? 0
      : Math.round((matchedSkills.length / job.extractedSkills.length) * 100);

  return {
    matchedSkills,
    missingSkills,
    score,
    recommendations: buildRecommendations(matchedSkills, missingSkills)
  };
}

function buildRecommendations(matchedSkills: string[], missingSkills: string[]) {
  const recommendations: string[] = [];

  if (matchedSkills.length > 0) {
    recommendations.push(`Lead with evidence for ${matchedSkills.slice(0, 3).join(", ")}.`);
  }

  if (missingSkills.length > 0) {
    recommendations.push(`Add a concise learning or project note for ${missingSkills[0]}.`);
  }

  if (recommendations.length === 0) {
    recommendations.push("Paste a richer job description before tailoring the application.");
  }

  return recommendations;
}

function normalizeSkill(skill: string) {
  return skill.toLowerCase().replace(/[^a-z0-9+#]/g, "");
}
