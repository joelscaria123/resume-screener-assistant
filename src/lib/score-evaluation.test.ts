
import { describe, expect, it } from "vitest";
import {
  calculateResumeScore,
} from "./score-evaluation";
import type { AIEvaluation } from "@/lib/analysis-schema";

function createEvaluation(
  requirements: AIEvaluation["requirements"]
): AIEvaluation {
  return {
    requirements,
    matchingSkills: [],
    skillGaps: [],
    interviewQuestions: [
      { question: "Question 1?", purpose: "Test skill 1" },
      { question: "Question 2?", purpose: "Test skill 2" },
      { question: "Question 3?", purpose: "Test skill 3" },
    ],
  };
}

describe("Resume Score Calculation", () => {
  it("returns 100 when all requirements are matched", () => {
    const evaluation = createEvaluation([
      {
        requirement: "React",
        importance: "mandatory",
        status: "matched",
        evidenceStrength: "strong",
        evidence: "Built React applications",
        reason: "Direct project evidence",
      },
    ]);

    expect(calculateResumeScore(evaluation).matchScore).toBe(100);
  });

  it("returns 0 when no requirements are evidenced", () => {
    const evaluation = createEvaluation([
      {
        requirement: "React",
        importance: "mandatory",
        status: "not_evidenced",
        evidenceStrength: "none",
        evidence: "",
        reason: "No supporting evidence",
      },
    ]);

    expect(calculateResumeScore(evaluation).matchScore).toBe(0);
  });

  it("gives partial credit for partially matched requirements", () => {
    const evaluation = createEvaluation([
      {
        requirement: "React",
        importance: "mandatory",
        status: "partially_matched",
        evidenceStrength: "moderate",
        evidence: "Some React project experience",
        reason: "Evidence is incomplete",
      },
    ]);

    expect(calculateResumeScore(evaluation).matchScore).toBe(50);
  });

  it("gives mandatory requirements more weight than preferred ones", () => {
    const evaluation = createEvaluation([
      {
        requirement: "React",
        importance: "mandatory",
        status: "matched",
        evidenceStrength: "strong",
        evidence: "React project experience",
        reason: "Direct evidence",
      },
      {
        requirement: "TypeScript",
        importance: "mandatory",
        status: "matched",
        evidenceStrength: "strong",
        evidence: "TypeScript project experience",
        reason: "Direct evidence",
      },
      {
        requirement: "Video player",
        importance: "mandatory",
        status: "not_evidenced",
        evidenceStrength: "none",
        evidence: "",
        reason: "No evidence",
      },
      {
        requirement: "Next.js",
        importance: "preferred",
        status: "matched",
        evidenceStrength: "strong",
        evidence: "Next.js project experience",
        reason: "Direct evidence",
      },
    ]);

    expect(calculateResumeScore(evaluation).matchScore).toBe(71);
  });
});
