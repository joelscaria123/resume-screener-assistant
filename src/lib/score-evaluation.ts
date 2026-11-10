
import {
  resumeAnalysisSchema,
  type AIEvaluation,
  type ResumeAnalysis,
} from "./analysis-schema";

const importanceWeights = {
  mandatory: 4,
  preferred: 2,
  optional: 1,
};

const statusScores = {
  matched: 1,
  partially_matched: 0.5,
  not_evidenced: 0,
};

export function calculateResumeScore(
  evaluation: AIEvaluation
): ResumeAnalysis {
  let totalScore = 0;
  let totalWeight = 0;

  let matched = 0;
  let partiallyMatched = 0;
  let notEvidenced = 0;

  for (const requirement of evaluation.requirements) {
    const weight = importanceWeights[requirement.importance];
    const score = statusScores[requirement.status];

    totalScore += weight * score;
    totalWeight += weight;

    if (requirement.status === "matched") matched++;
    else if (requirement.status === "partially_matched") {
      partiallyMatched++;
    } else {
      notEvidenced++;
    }
  }

  const matchScore =
    totalWeight === 0
      ? 0
      : Math.round((totalScore / totalWeight) * 100);

  const scoreRationale =
    `The candidate matched ${matched} requirements, ` +
    `partially matched ${partiallyMatched}, and did not demonstrate ` +
    `${notEvidenced} requirements. The score considers the importance ` +
    `of each job requirement.`;

  return resumeAnalysisSchema.parse({
    matchScore,
    scoreRationale,
    matchingSkills: evaluation.matchingSkills,
    skillGaps: evaluation.skillGaps,
    interviewQuestions: evaluation.interviewQuestions,
  });
}
