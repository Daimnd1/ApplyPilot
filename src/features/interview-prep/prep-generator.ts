export type InterviewPrepInput = {
  company: string;
  roleTitle: string;
  extractedSkills: string[];
  responsibilities: string[];
};

export type GeneratedInterviewPrep = {
  technicalQuestions: string[];
  behavioralQuestions: string[];
  companyQuestions: string[];
};

export function generateInterviewPrep(input: InterviewPrepInput): GeneratedInterviewPrep {
  const technicalQuestions = input.extractedSkills.slice(0, 4).map(
    (skill) => `Describe a project where you used ${skill}. What tradeoffs did you make?`
  );

  const responsibilityQuestions = input.responsibilities.slice(0, 2).map(
    (responsibility) => `How would you approach this part of the role: ${asQuestionPrompt(responsibility)}?`
  );

  return {
    technicalQuestions: uniqueQuestions([
      ...technicalQuestions,
      ...responsibilityQuestions,
      "How do you test a change before shipping it?"
    ]).slice(0, 6),
    behavioralQuestions: [
      `Tell me about a time you had to learn quickly for a ${input.roleTitle} task.`,
      "Describe a time you debugged a problem with incomplete information.",
      "How have you handled feedback on code or a project decision?"
    ],
    companyQuestions: [
      `What would success look like for a junior ${input.roleTitle} at ${input.company} in the first months?`,
      `Which product or engineering problems would this ${input.roleTitle} role work on first?`,
      "How does the team support code review, mentoring, and growth?"
    ]
  };
}

function asQuestionPrompt(text: string) {
  return text.trim().replace(/[.!?]+$/, "");
}

function uniqueQuestions(questions: string[]) {
  return [...new Set(questions.filter(Boolean))];
}
